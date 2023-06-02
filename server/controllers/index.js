// controllers.js
const pool = require('../../db/postgresql');
const client = require('../redis');

const controllers = {
  product: {
    getAll: async (req, res) => {
      const { page = 1, count = 5 } = req.query;
      const key = `products:${page}:${count}`;

      try {
        let products = await client.get(key);
        if (products) {
          return res.status(200).json(JSON.parse(products));
        } else {
          const result = await pool.query(
            `
            SELECT * FROM products
            LIMIT $1 OFFSET $2
          `,
            [count, (page - 1) * count]
          );

          await client.set(key, JSON.stringify(result.rows), 'EX', 3600);
          return res.status(200).json(result.rows);
        }
      } catch (error) {
        return res.status(500).send(error);
      }
    },

    getOne: async (req, res) => {
      const { product_id } = req.params;
      const key = `product:${product_id}`;

      try {
        let product = await client.get(key);
        if (product) {
          return res.status(200).json(JSON.parse(product));
        } else {
          const result = await pool.query(
            `
            SELECT * FROM products
            WHERE id = $1
          `,
            [product_id]
          );
          await client.set(key, JSON.stringify(result.rows[0]), 'EX', 3600);
          return res.status(200).json(result.rows[0]);
        }
      } catch (error) {
        return res.status(500).send(error);
      }
    },

    getStyles2: async (req, res) => {
      const { product_id } = req.params;
      const key = `styles:${product_id}`;
    
      try {
        let styles = await client.get(key);
        if (styles) {
          return res.status(200).json(JSON.parse(styles));
        } else {
          const stylesQuery = pool.query(
            `
            SELECT s.style_id, s.name, s.original_price, s.sale_price, s.product_id,
            (s.default_style::integer = 1) AS "default?"
            FROM styles s
            WHERE s.product_id = $1
            `,
            [product_id]
          );
    
          const photosQuery = pool.query(
            `
            SELECT p.style_id, json_build_object('id', p.id, 'url', p.url, 'thumbnail_url', p.thumbnail_url) as photo
            FROM photos p
            WHERE p.style_id IN (SELECT s.style_id FROM styles s WHERE s.product_id = $1)
            `,
            [product_id]
          );
    
          const skusQuery = pool.query(
            `
            SELECT sk.style_id, json_build_object('id', sk.id, 'quantity', sk.quantity, 'size', sk.size) as sku
            FROM skus sk
            WHERE sk.style_id IN (SELECT s.style_id FROM styles s WHERE s.product_id = $1)
            `,
            [product_id]
          );
    
          const [stylesResult, photosResult, skusResult] = await Promise.all([
            stylesQuery,
            photosQuery,
            skusQuery
          ]);
    
          const photosByStyleId = photosResult.rows.reduce((acc, row) => {
            acc[row.style_id] = acc[row.style_id] || [];
            acc[row.style_id].push(row.photo);
            return acc;
          }, {});
    
          const skusByStyleId = skusResult.rows.reduce((acc, row) => {
            acc[row.style_id] = acc[row.style_id] || {};
            acc[row.style_id][row.sku.id] = { quantity: row.sku.quantity, size: row.sku.size };
            return acc;
          }, {});
    
          const styleIds = stylesResult.rows.map(row => row.style_id);
    
          styleIds.forEach(styleId => {
            if (!photosByStyleId[styleId]) {
              photosByStyleId[styleId] = [
                {
                  id: null,
                  url: null,
                  thumbnail_url: null
                }
              ];
            }
            if (!skusByStyleId[styleId]) {
              skusByStyleId[styleId] = {
                null: {
                  quantity: null,
                  size: null
                }
              };
            }
          });
    
          const results = stylesResult.rows.map(row => {
            return {
              ...row,
              photos: photosByStyleId[row.style_id] || [],
              skus: skusByStyleId[row.style_id] || {}
            };
          });
    
          await client.set(key, JSON.stringify({ product_id, results }), 'EX', 3600);
          return res.status(200).json({ product_id, results });
        }
      } catch (error) {
        return res.status(500).send(error);
      }
    },
    getRelated: async (req, res) => {
      const { product_id } = req.params;
      const key = `related:${product_id}`;

      try {
        let related = await client.get(key);
        if (related) {
          return res.status(200).json(JSON.parse(related));
        } else {
          const result = await pool.query(
            `
            SELECT related_product_id
            FROM related_items
            WHERE product_id = $1
          `,
            [product_id]
          );
          const relatedProductIds = result.rows.map(row => row.related_product_id);
          await client.set(key, JSON.stringify(relatedProductIds), 'EX', 3600);
          return res.status(200).json(relatedProductIds);
        }
      } catch (error) {
        return res.status(500).send(error);
      }
    },
  }

  // getStyles: async (req, res) => {
  //   const { product_id } = req.params;

  //   try {
  //     const styles = await pool.query(
  //       `
  //     SELECT * FROM styles WHERE product_id = $1
  //   `,
  //       [product_id]
  //     );

  //     const stylesWithPhotosAndSkus = await Promise.all(
  //       styles.rows.map(async style => {
  //         const photos = await pool.query(
  //           `
  //       SELECT * FROM photos WHERE style_id = $1
  //     `,
  //           [style.style_id]
  //         );

  //         const skus = await pool.query(
  //           `
  //       SELECT * FROM skus WHERE style_id = $1
  //     `,
  //           [style.style_id]
  //         );
  //         style['default?'] = !!style.default_style;
  //         delete style.default_style;
  //         return {
  //           ...style,
  //           photos: photos.rows.map(photo => ({
  //             thumbnail_url: photo.thumbnail_url || null,
  //             url: photo.url || null
  //           })),
  //           skus: skus.rows.reduce((acc, sku) => {
  //             acc[sku.id] = { quantity: sku.quantity, size: sku.size };
  //             return acc;
  //           }, {})
  //         };
  //       })
  //     );

  //     res
  //       .status(200)
  //       .json({ product_id: parseInt(product_id, 10), results: stylesWithPhotosAndSkus });
  //   } catch (error) {
  //     res.status(500).send(error);
  //   }
  // },
  // cart: {
  //   get: async (req, res) => {
  //     try {
  //       const result = await pool.query(`
  //         SELECT sku_id, count FROM cart
  //       `);
  //       res.status(200).json(result.rows);
  //     } catch (error) {
  //       res.status(500).send(error);
  //     }
  //   },

  //   post: async (req, res) => {
  //     const { sku_id } = req.body;

  //     if (!sku_id) {
  //       res.status(400).send({ message: 'Missing required parameter: sku_id' });
  //       return;
  //     }

  //     try {
  //       // Check if sku_id exists in the cart already
  //       const result = await pool.query(
  //         `
  //         SELECT count FROM cart WHERE sku_id = $1
  //       `,
  //         [sku_id]
  //       );

  //       if (result.rowCount > 0) {
  //         // Update the existing item in the cart
  //         const count = result.rows[0].count + 1;
  //         await pool.query(
  //           `
  //           UPDATE cart
  //           SET count = $1
  //           WHERE sku_id = $2
  //         `,
  //           [count, sku_id]
  //         );
  //       } else {
  //         // Add a new item to the cart
  //         await pool.query(
  //           `
  //           INSERT INTO cart (sku_id, count)
  //           VALUES ($1, 1)
  //         `,
  //           [sku_id]
  //         );
  //       }

  //       res.status(201).send({ message: 'Product added to cart successfully' });
  //     } catch (error) {
  //       res.status(500).send(error);
  //     }
  //   }
  // }
};

module.exports = controllers;
