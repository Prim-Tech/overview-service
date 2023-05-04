require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'danny',
  password: process.env.POSTGRES_PASSWORD,
  database: 'mydb',
});

pool.connect((err, client, release) => {
  // if (err) {
  //   console.error('Error connecting to the PostgreSQL database:', err);
  // } else {
  //   console.log('Connected to the PostgreSQL database.');
  // }
});

module.exports = pool;
