// controllers without redis
const pool = require('../../db/postgresql');

const controllers = {
    product: {
      getAll: async (req, res) => {
        const { page = 1, count = 5 } = req.query;
        const lastId = (page - 1) * count;
  
        try {
          const result = await pool.query(
            `
            SELECT * FROM products
            WHERE id > $1
            ORDER BY id
            LIMIT $2
            `,
            [lastId, count]
          );
  
          return res.status(200).json(result.rows);
        } catch (error) {
          return res.status(500).send(error);
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
  
          return res.status(200).json(result.rows[0]);
        } catch (error) {
          return res.status(500).send(error);
        }
      },
  
      getStyles: async (req, res) => {
        const { product_id } = req.params;
  
        try {
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
  
          return res.status(200).json({ product_id, results });
        } catch (error) {
          return res.status(500).send(error);
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
          const relatedProductIds = result.rows.map(row => row.related_product_id);
          return res.status(200).json(relatedProductIds);
        } catch (error) {
          return res.status(500).send(error);
        }
      },
    }
  }

module.exports = controllers;