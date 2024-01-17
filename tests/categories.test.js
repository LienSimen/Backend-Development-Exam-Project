const express = require("express");
const request = require('supertest');
const authRouter = require('../routes/auth');
const categoryRouter = require('../routes/category');
const app = express();
const cookieParser = require('cookie-parser');
const db = require("../models");


app.use(express.json());
app.use(cookieParser());
app.use('/auth', authRouter);
app.use('/categories', categoryRouter);

let token;

beforeAll(async () => {
    // Admin login for JWT
  const res = await request(app)
    .post('/auth/login')
    .send({ username: 'Admin', password: 'P@ssword2023' });
  token = res.body.token;
});

describe('Category CRUD operations', () => {
  let categoryId;

  test('Create a new category', async () => {
    const res = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'TEST_CATEGORY' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual('TEST_CATEGORY');
    categoryId = res.body.id;
  });

  test('Get all categories', async () => {
    const res = await request(app)
      .get('/categories')
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('length');
    expect(res.body.length).toBeGreaterThan(0);
  });

  test('Update the category', async () => {
    const res = await request(app)
      .put(`/categories/${categoryId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'TEST_CATEGORY_UPDATED' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Category updated successfully');
    });

    test('Delete the category', async () => {
        const res = await request(app)
            .delete(`/categories/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toEqual('Category deleted successfully');
    });
    afterAll(async () => {
       db.sequelize.close();
    });
});