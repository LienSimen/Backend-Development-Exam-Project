const express = require("express");
const request = require('supertest');
const authRouter = require('../routes/auth');
const categoryRouter = require('../routes/category');
const productRouter = require('../routes/product');
const app = express();
const cookieParser = require('cookie-parser');
const db = require("../models");

app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);

let token;
let testCategoryId;
let testProductId;

beforeAll(async () => {
// Admin login and category creation
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'Admin', password: 'P@ssword2023' });
  token = res.body.token;
    const category = await request(app)
    .post('/categories')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'TEST_CATEGORY' });
  testCategoryId = category.body.id;
});


describe('Product CRUD operations', () => {
    test('Admin can create a new product', async () => {
      const res = await request(app)
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TEST_PRODUCT',
            description: 'TEST_PRODUCT for testing',
            price: 1000,
            quantity: 10,
            categoryId: testCategoryId,
            brandId: 1,
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('productId');
      testProductId = res.body.productId;
    });
  
    test('Get all products', async () => {
      const res = await request(app)
        .get('/products')
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
    });
  
    test('Get a single product', async () => {
      const res = await request(app)
        .get(`/products/${testProductId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('productId', testProductId);
    });
  
    test('Update a product', async () => {
      const res = await request(app)
        .put(`/products/${testProductId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
            name: 'TEST_PRODUCT_UPDATED',
            description: 'TEST_PRODUCT_UPDATED for testing',
            price: 1000,
            categoryId: testCategoryId,
            brandId: 1,
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('Product updated successfully');
    });
  
    test('Soft delete a product', async () => {
      const res = await request(app)
        .delete(`/products/${testProductId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toEqual('Product soft deleted successfully');
    });
    afterAll(async () => {
        db.sequelize.close();
     });
  });
