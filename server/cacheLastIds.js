const pool = require('../db/postgresql');
const client = require('./redis');

const count = 5;

const cacheLastIds = async () => {
  try {
    await client.connect();
    let lastId = 0;
    let page = 1;

    while (true) {
      const result = await pool.query(
        `
        SELECT * FROM products
        WHERE id > $1
        ORDER BY id
        LIMIT $2
        `,
        [lastId, count]
      );
      
      if (result.rows.length > 0) {
        lastId = result.rows[result.rows.length - 1].id;
        const key = `products:lastId:${page}:${count}`;
        await client.set(key, lastId);
        page += 1;
      } else {
        break;
      }
    }

    console.log('Pre-caching completed.');
  } catch (error) {
    console.error('An error occurred during pre-caching:', error);
  } finally {
    await client.disconnect();
    pool.end();
    process.exit(0);
  }
};

cacheLastIds();
