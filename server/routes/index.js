// routes.js
const express = require("express");
const router = express.Router();
const controllers = require('../controllers');

router.get('/', controllers.product.getAll);
router.get('/2', controllers.product.getAll2);
router.get('/:product_id', controllers.product.getOne);
router.get('/:product_id/styles', controllers.product.getStyles2);
router.get('/:product_id/related', controllers.product.getRelated);
// router.get('/cart', controllers.cart.get);
// router.post('/cart', controllers.cart.post);

module.exports = router;