const client = require('./redis');

(async () => {
  require('dotenv').config();
  const express = require('express');
  const session = require('express-session');
  const routes = require('./routes');

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  }));

  app.use(function(err, req, res, next) {
    console.error(`Error: ${err.message}`);
    console.error(`Error stack: ${err.stack}`);
    console.error(`Request method: ${req.method}`);
    console.error(`Request path: ${req.path}`);
    console.error(`Request body: ${JSON.stringify(req.body)}`);
    res.status(500).send('Something broke!');
  });  

  app.use('/products', routes);
  const port = process.env.PORT || 3000;
  await client.connect();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();

process.on('SIGINT', async () => {
  await client.disconnect();
  process.exit(0);
});