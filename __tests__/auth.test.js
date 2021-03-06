const { getAgent } = require('../data/data-helpers');
const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const userService = require('../lib/services/user-service');

describe('auth routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a user', async() => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'email@domain.com',
        profilePhotoUrl: 'https://placekitten.com/200/200',
        password: '1234'
      });
    expect(response.body).toEqual({
      id: expect.any(String),
      profilePhotoUrl: 'https://placekitten.com/200/200',
      email: 'email@domain.com'
    });
  });

  it('allows a user to login with email and password.', async() => {
    const user = await userService.create({
      email: 'email2@domain.com',
      password: '1234',
      profilePhotoUrl: 'https://placekitten.com/200/200' 
    });
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'email2@domain.com',
        password: '1234'
      });
    expect(response.body).toEqual({
      id: user.id,
      email: 'email2@domain.com',
      profilePhotoUrl: 'https://placekitten.com/200/200'
    });
  });

  it('verifies a user via GET', async() => {
    const agent = request.agent(app);
    await agent
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        profilePhotoUrl: 'https://placekitten.com/200/200',
        password: 'password'
      });

    const response = await agent
      .get('/api/v1/auth/verify');

    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'test@test.com',
      profilePhotoUrl: 'https://placekitten.com/200/200'
    });

    const responseWithoutAUser = await request(app)
      .get('/api/v1/auth/verify');

    expect(responseWithoutAUser.body).toEqual({
      status: 500,
      message: 'jwt must be provided'
    });
  });
});
