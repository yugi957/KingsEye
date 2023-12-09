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

describe("Best move endpoint", () => {
  test('Should return a best move', async () => {
        const res = await request(app).get('/bestmove').query({
          fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b - - 0 14'
        });
        await expect(res.statusCode).toBe(200);
        await expect(res.body).toStrictEqual({
          "firstMove": "b8c6",
          "secondMove": "f1c4"
        })
  });
});

describe("Get games endpoint", () => {
  test('Should return games', async () => {
        const correct_result_section = "";
        const res = await request(app).get('/getGames').query({
          email: 'qaz@qaz.com'
        });
        await expect(res.statusCode).toBe(200);
        await expect(res.body["pastGames"][0]["gameID"]).toEqual(1);
        await expect(res.body["pastGames"][0]["opponentName"]).toEqual("Adi pillai 123");
  });
  test('Should return no games', async () => {
    const correct_result_section = "";
    const res = await request(app).get('/getGames').query({
      email: 'dhruv.agarwals@gmail.com'
    });
    await expect(res.statusCode).toBe(200);
    await expect(res.body["pastGames"].length).toEqual(0);  
  });
});
  
  
