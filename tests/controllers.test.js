// controllers.test.js
const { product } = require('../server/controllers');
const pool = require('../db/postgresql');

jest.mock('../db/postgresql');

describe('Product Controller Methods', () => {
  afterEach(() => {
    pool.query.mockReset();
  });

  const req = { params: { product_id: 1 }, query: {} };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };

  test('getAll - Should call the pool.query() function', async () => {
    await product.getAll(req, res);
    expect(pool.query).toHaveBeenCalled();
  });

  test('getOne - Should call the pool.query() function with the correct parameters', async () => {
    const { product_id } = req.params;
    await product.getOne(req, res);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [product_id]);
  });

  test('getStyles - Should call the pool.query() function with the correct parameters', async () => {
    const { product_id } = req.params;
    await product.getStyles(req, res);
    expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String), [product_id]);
  });

  test('getStyles2 - Should call the pool.query() function with the correct parameters', async () => {
    const { product_id } = req.params;
    await product.getStyles2(req, res);
    expect(pool.query).toHaveBeenNthCalledWith(1, expect.any(String), [product_id]);
  });
  
  test('getRelated - Should call the pool.query() function with the correct parameters', async () => {
    const { product_id } = req.params;
    await product.getRelated(req, res);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [product_id]);
  });
});
