const request = require('supertest');
const app = require('../server');

test('POST /signUp', () => {
    it('should add one user', async () => {
      const res = await request(app).post('/signUp').send({
        email: 'user1@example.com',
        password: '123456',
      });
      await expect(res.statusCode).toBe(200);
      await expect(res.body).toBe('Data received!');
    });
   });

