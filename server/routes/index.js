// routes.js
const express = require("express");
const router = express.Router();
const controllers = require('../controllers');

router.get('/products', controllers.product.getAll);
router.get('/products/:product_id', controllers.product.getOne);
router.get('/products/:product_id/styles', controllers.product.getStyles);
router.get('/products/:product_id/related', controllers.product.getRelated);
router.get('/cart', controllers.cart.get);
router.post('/cart', controllers.cart.post);

module.exports = router;