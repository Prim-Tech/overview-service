require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'danny',
  password: process.env.POSTGRES_PASSWORD,
  database: 'mydb',
});

module.exports = pool;
