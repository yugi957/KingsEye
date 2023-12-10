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
      }, 7500);
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
  }, 7500);
});

describe("Get games endpoint", () => {
  test('Should return games', async () => {
        const res = await request(app).get('/getGames').query({
          email: 'qaz@qaz.com'
        });
        await expect(res.statusCode).toBe(200);
        await expect(res.body["pastGames"][0]["gameID"]).toEqual(1);
        await expect(res.body["pastGames"][0]["opponentName"]).toEqual("Adi pillai 123");
  });
  test('Should return no games', async () => {
    const res = await request(app).get('/getGames').query({
      email: 'Bjenk@gmail.com'
    });
    await expect(res.statusCode).toBe(200);
    await expect(res.body["pastGames"].length).toEqual(0);  
  });
});

describe("Set user data endpoint", () => {
  test('Should edit user data', async () => {
        const user = await request(app).get('/getUser').query({
          email: 'dhruv.agarwals@gmail.com'
        });
        let reversed_fname = user.body["firstName"].split("").reverse().join("");
        let reversed_lname = user.body["lastName"].split("").reverse().join("");

        const res = await request(app).post('/setUserData').send({
          email: 'dhruv.agarwals@gmail.com',
          fname: reversed_fname,
          lname: reversed_lname
        });
        await expect(res.statusCode).toBe(200);
        await expect(res.body).toStrictEqual({"message": "User data updated successfully"});
  });
  test('Should fail to edit user data', async () => {
    const res = await request(app).post('/setUserData').send({
      email: 'thisemailwillbeinvalidbecauseitdoesnotexist_heeeheee@hotmail.com',
      fname: "Dhruv",
      lname: "Agarwal"
    });
    await expect(res.statusCode).toBe(404);
    await expect(res.body).toStrictEqual({"message": "User not found"});
  });
});

describe("Change game data", () => {
  test('Should add game to user', async () => {
        const res = await request(app).post('/saveGame').send({
          "email": "dhruv.agarwals@gmail.com",
          "gameID": 1,
          "opponentName": "Buster Jr",
          "date": "Mannn",
          "title": "Uh huh honey",
          "starred": "false",
          "moves": ["fen"],
          "status": "4",
          "side": "0",
          "notes": "people be people"
        });

        await expect(res.statusCode).toBe(200);
        await expect(res.body).toStrictEqual({"message": "Game saved successfully"});
  });
  test('Should edit game data', async () => {
    const res = await request(app).patch('/updateGame').send({
      "email": "dhruv.agarwals@gmail.com",
      "gameID": 1,
      "title": "YEAHHHHHHHHHHH BUDDDY"
    });
    await expect(res.statusCode).toBe(200);
    await expect(res.body).toStrictEqual({"message": "Game updated successfully"});
  });  
  test('Should delete test', async () => {
    const res = await request(app).delete('/deleteGame').send({
      gameID: 1,
      email: "dhruv.agarwals@gmail.com"
    });
    await expect(res.statusCode).toBe(200);
    await expect(res.body).toStrictEqual({"message": "Game deleted successfully"});
  });
});
  
  
