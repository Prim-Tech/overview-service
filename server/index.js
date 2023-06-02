const client = require('./redis');

(async () => {
  const path = require('path');
  require('dotenv').config();
  const express = require('express');
  const routes = require('./routes');
  const app = express();
  const loaderioPath = path.join(__dirname, 'public');
  console.log(loaderioPath)
  app.use(express.static(loaderioPath));
  app.use(express.json());

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