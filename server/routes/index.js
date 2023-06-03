// routes.js
const express = require("express");
const router = express.Router();
const controllers = require('../controllers');
const controllersWithoutRedis = require('../controllers/noRedis');

router.get('/noredis/', controllersWithoutRedis.product.getAll);
router.get('/noredis/:product_id', controllersWithoutRedis.product.getOne);
router.get('/noredis/:product_id/styles', controllersWithoutRedis.product.getStyles);
router.get('/noredis/:product_id/related', controllersWithoutRedis.product.getRelated);

router.get('/', controllers.product.getAll);
router.get('/:product_id', controllers.product.getOne);
router.get('/:product_id/styles', controllers.product.getStyles);
router.get('/:product_id/related', controllers.product.getRelated);

module.exports = router;