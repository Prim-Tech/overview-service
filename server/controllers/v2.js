// controllers.js
const pool = require('../../db/postgresql');

const controllers = {
  product: {
    getAll: async (req, res) => {
      const { page = 1, count = 5 } = req.query;

      try {
        const result = await pool.query(
          `
          SELECT * FROM products
          LIMIT $1 OFFSET $2
        `,
          [count, (page - 1) * count]
        );
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).send(error);
      }
    },

    getOne: async (req, res) => {
      const { product_id } = req.params;

      try {
        const result = await pool.query(
          `
          SELECT * FROM products
          WHERE id = $1
        `,
          [product_id]
        );
        res.status(200).json(result.rows[0]);
      } catch (error) {
        res.status(500).send(error);
      }
    },
    getStyles: async (req, res) => {
      const { product_id } = req.params;

      try {
        const styles = await pool.query(`
          SELECT s.*,
            json_agg(json_build_object('id', p.id, 'url', p.url, 'thumbnail_url', p.thumbnail_url)) as photos,
            json_object_agg(sk.id, json_build_object('quantity', sk.quantity, 'size', sk.size)) as skus
          FROM styles s
          LEFT JOIN photos p ON s.id = p.style_id
          LEFT JOIN skus sk ON s.id = sk.style_id
          WHERE s.product_id = $1
          GROUP BY s.id
        `, [product_id]);

        res.status(200).json({ product_id, results: styles.rows });
      } catch (error) {
        res.status(500).send(error);
      }
    },
    getRelated: async (req, res) => {
      const { product_id } = req.params;

      try {
        const result = await pool.query(
          `
        SELECT related_product_id
        FROM related_items
        WHERE product_id = $1
      `,
          [product_id]
        );
        res.status(200).json(result.rows.map(row => row.related_product_id));
      } catch (error) {
        res.status(500).send(error);
      }
    }
  },

  cart: {
    get: async (req, res) => {
      try {
        const result = await pool.query(`
          SELECT sku_id, count FROM cart
        `);
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).send(error);
      }
    },

    post: async (req, res) => {
      const { sku_id } = req.body;

      if (!sku_id) {
        res.status(400).send({ message: 'Missing required parameter: sku_id' });
        return;
      }

      try {
        // Check if sku_id exists in the cart already
        const result = await pool.query(
          `
          SELECT count FROM cart WHERE sku_id = $1
        `,
          [sku_id]
        );

        if (result.rowCount > 0) {
          // Update the existing item in the cart
          const count = result.rows[0].count + 1;
          await pool.query(
            `
            UPDATE cart
            SET count = $1
            WHERE sku_id = $2
          `,
            [count, sku_id]
          );
        } else {
          // Add a new item to the cart
          await pool.query(
            `
            INSERT INTO cart (sku_id, count)
            VALUES ($1, 1)
          `,
            [sku_id]
          );
        }

        res.status(201).send({ message: 'Product added to cart successfully' });
      } catch (error) {
        res.status(500).send(error);
      }
    }
  }
};

module.exports = controllers;