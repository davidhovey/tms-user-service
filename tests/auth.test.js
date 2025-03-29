const request = require('supertest');
const app = require('../server');
const pool = require('../db');
const waitForPostgres = require('./utils/wait-for-postgres');

const testUser = {
  username: `testuser_${Date.now()}`,
  password: 'testpass',
  email: `testuser_${Date.now()}@example.com`
};

let token;

beforeAll(async () => {
  await waitForPostgres(); // 👈 wait until DB is ready
});

beforeEach(async () => {
  await pool.query(`DELETE FROM users WHERE username LIKE 'testuser_%'`);
});

afterAll(async () => {
  await pool.end();
});

describe('Auth routes', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send(testUser);
    expect(res.statusCode).toBe(201);
  });

  it('should login with the new user and receive a JWT', async () => {
    await request(app).post('/auth/register').send(testUser);
    const res = await request(app).post('/auth/login').send({
      username: testUser.username,
      password: testUser.password
    });
    expect(res.statusCode).toBe(200);
    token = res.body.token;
    expect(token).toBeDefined();
  });

  it('should verify the token and return user info', async () => {
    await request(app).post('/auth/register').send(testUser);
    const loginRes = await request(app).post('/auth/login').send({
      username: testUser.username,
      password: testUser.password
    });
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${loginRes.body.token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('username', testUser.username);
  });
});
