const express = require("express");
const request = require('supertest');
const authRouter = require('../routes/auth'); 
const app = express();
const db = require("../models");

app.use(express.json());
app.use('/auth', authRouter);

describe('POST /auth/login', () => {
  test('login with a valid user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'Admin', password: 'P@ssword2023' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toEqual('Logged in successfully');

  });

  test('login fail with wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'invalidUser', password: 'invalidPassword' });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Wrong credentials');
  });
  afterAll(async () => {
    db.sequelize.close();
 });
});

