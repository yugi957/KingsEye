const request = require('supertest');
const app = require('../server.js');

describe("Signup endpoint", () => {
  test('Should signup a user', async () => {
        const res = await request(app).post('/signUp').send({
          email: 'jester@example.com',
          password: '123456',
          fname: "jest",
          lname: "test"
        });
        await expect(res.statusCode).toBe(200);
        await expect(res.body).toStrictEqual({"message": "Data received!"});
      });
  });
