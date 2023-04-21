require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432, // Default PostgreSQL port. Change it if necessary.
  user: 'danny', // Replace with your PostgreSQL username.
  password: process.env.POSTGRES_PASSWORD, // Replace with your PostgreSQL password.
  database: 'mydb', // Replace with your PostgreSQL database name.
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the PostgreSQL database:', err);
  } else {
    console.log('Connected to the PostgreSQL database.');
  }
});

module.exports = pool;
