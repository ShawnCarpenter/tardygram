const fs = require('fs');
const pool = require('../lib/utils/pool');
const seed = require('./seed');
const request = require('supertest');
const app = require('../lib/app');

beforeEach(() => {
  return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
});

beforeEach(() => {
  return seed();
});

const agent = request.agent(app);
beforeEach(() => {
  return agent
    .post('/api/v1/auth/login')
    .send({
      email: 'email0@domain.com',
      password: 'password0'
    });
});

module.exports = {
  getAgent: () => agent
};

