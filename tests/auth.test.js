const request = require('supertest');
const app = require('../server');

describe('Auth routes', () => {
  it('should respond to POST /auth/register', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        username: 'testuser1',
        password: 'testpass',
        email: 'testuser1@example.com'
      });

    expect(response.statusCode).toBe(201);
  });
});
