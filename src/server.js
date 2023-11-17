const express = require("express");
const stockfish = require("stockfish");
const engine = stockfish();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(cors());
var http = require('http');
const port = process.env.PORT || 3000;

const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const fenregex = "/^([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s(0|[1-9][0-9]*)\s([1-9][0-9]*)/"

app.use(bodyParser.json());

function stringToHash(string) {

  let hash = 0;

  if (string.length == 0) return hash;

  for (i = 0; i < string.length; i++) {
    char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  return hash;
}

app.post('/signup', async (req, res) => {
  try {
    await client.connect();
    await client.db("kings-eye").collection("user-database").insertOne(
      {
        email: req.body.email,
        id: stringToHash(req.body.email),
        fname: req.body.fname,
        lname: req.body.lname,
        profilePic: 'base64string',
        games: []
      });

    await client.close();
    res.json({ message: 'Data received!' });
  } catch (err) {
    console.error(err);
  }
});

app.post('/googleLogin', async (req, res) => {
  try {
    await client.connect();
    photo = req.body.photo
    const user = await client.db("kings-eye").collection("user-database").findOne({ email: req.body.email });
    if (user) {
      await client.close();
      res.json({ message: 'Email in use.' });
    } else {
      await client.db("kings-eye").collection("user-database").insertOne(
        {
          email: req.body.email,
          id: stringToHash(req.body.email),
          fname: req.body.name.split(" ")[0],
          lname: req.body.name.split(" ")[1],
          profilePic: 'base64string',
          games: []
        });
      res.json({ message: 'Data recieved' });
    }
  } catch (err) {
    console.error(err);
  }
});

app.get('/getUser', (req, res) => {
  var userData = {};
  async function run() {
    try {
      await client.connect();
      const collection = client.db("kings-eye").collection("user-database");

      const query = { email: req.query.email };
      const user = await collection.findOne(query);

      if (user) {
        userData = {
          email: user["email"],
          firstName: user["fname"],
          lastName: user["lname"],
          profileImage: user["profilePic"],
        };
        res.json(userData);
      } else {
        res.status(404).json({ message: "User not found" });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});


app.patch('/setUserData', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");

    const query = { email: req.body.email };
    const newValues = { $set: { fname: req.body.fname, lname: req.body.lname, profilePic: req.body.photo } };

    const result = await collection.updateOne(query, newValues);

    if (result.matchedCount === 0) {
      res.status(404).json({ message: 'User not found' });
    } else if (result.modifiedCount === 0) {
      res.status(200).json({ message: 'No changes made to the user data' });
    } else {
      res.status(200).json({ message: 'User data updated successfully' });
    }
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  } finally {
    await client.close();
  }
});

app.post('/saveGame', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");

    const query = {
      email: req.body.email,
    };

    const user = await collection.findOne(query);
    console.log(user)
    let games = user["games"];
    console.log(games)
    games.push({
      "gameID": games.length + 1,
      "opponentName": req.body.opponent,
      "date": req.body.date,
      "title": req.body.title,
      "starred": false,
      "moves": [req.body.fen_string]
    });

    const updateQuery = {
      $set: {
        games: games
      }
    };

    await collection.updateOne(query, updateQuery);
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});

app.get('/getGames', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");

    const query = { email: req.query.email };

    const user = await collection.findOne(query);
    if (user) {
      let games = user["games"];
      res.json({ pastGames: games });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  } finally {
    await client.close();
  }
});


engine.postMessage("uci");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DEPTH = '12'

app.get('/bestMove', (request, response) => {
  engine.onmessage = function (msg) {
    if (response.headersSent) {
      return;
    }

    if (msg.includes("mate 0")) {
      response.send({ message: "Game over" });
      return;
    }

    const match = /bestmove (\w+) (ponder (\w+))?/.exec(msg);
    if (match) {
      const bestMove = match[1];
      const ponderMove = match[3];
      response.send({ firstMove: bestMove, secondMove: ponderMove });
    }
  };

  engine.postMessage('ucinewgame');
  engine.postMessage('position fen ' + request.query.fen);
  engine.postMessage(`go depth ${DEPTH}`);
});


app.get('/evaluationScore', (request, response) => {
  let evaluationScore = null;
  engine.onmessage = function (msg) {
    console.log(msg);
    if (response.headersSent) {
      return;
    }
    const match = msg.match(/score (cp|mate) ([-\d]+)/);
    if (match) {
      const scoreType = match[1];
      const scoreValue = match[2];
      evaluationScore = scoreType === 'cp' ? parseInt(scoreValue, 10) : `Mate in ${scoreValue}`;
    }

    if (typeof (msg) === "string" && msg.match("bestmove") && evaluationScore !== null) {
      response.send({ evaluation: evaluationScore });
    }
  }

  engine.postMessage("ucinewgame");
  engine.postMessage("position fen " + request.query.fen);
  engine.postMessage(`go depth ${DEPTH}`);
});

app.get('/principalVariation', (request, response) => {
  let principalVariation = null;
  let isGameOver = false;

  engine.onmessage = function (msg) {
    if (msg.includes("mate 0")) {
      isGameOver = true;
      response.send({ message: "Game Over" });
      return;
    }

    const pvMatch = msg.match(/pv\s(.+)/);
    if (pvMatch) {
      principalVariation = pvMatch[1];
    }

    if (msg.startsWith('bestmove') && principalVariation) {
      const allElements = principalVariation.split(/\s+/);
      const moves = allElements.slice(11);
      response.send({ moves: moves });
    }
  };

  engine.postMessage('ucinewgame');
  engine.postMessage('position fen ' + request.query.fen);
  engine.postMessage(`go depth ${DEPTH}`);
});


app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log('Server is listening on', port);
})