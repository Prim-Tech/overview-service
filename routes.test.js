// routes.test.js
const request = require('supertest');
const express = require('express');
const router = require('./server/routes');

const app = express();
app.use(express.json());
app.use('/products', router);

describe('Product Routes', () => {
  it('GET /products - Should return a list of products', async () => {
    const res = await request(app).get('/products');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /products/:product_id - Should return a single product', async () => {
    const product_id = 1;
    const res = await request(app).get(`/products/${product_id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(product_id);
  });

  it('GET /products/:product_id/styles - Should return styles, photos, and SKUs data for a product', async () => {
    const product_id = '1';
    const res = await request(app).get(`/products/${product_id}/styles`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.product_id).toEqual(product_id);
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  it('GET /products/:product_id/related - Should return an array of related product IDs', async () => {
    const product_id = 1;
    const res = await request(app).get(`/products/${product_id}/related`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});

describe('Error handling', () => {
  it('GET non-existing route - Should return 404 status code', async () => {
    const res = await request(app).get('/non-existing-route');
    expect(res.statusCode).toEqual(404);
  });
});