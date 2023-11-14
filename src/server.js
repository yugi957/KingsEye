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

app.post('/getUser', (req, res) => {
  var userData = {};
  async function run() {
    try {
      await client.connect();
      const collection = client.db("kings-eye").collection("user-database");

      const query = { email: req.body.email };
      const user = await collection.findOne(query);
      console.log(user["email"]);
      userData = {
        email: user["email"],
        firstName: user["fname"],
        lastName: user["lname"],
        profileImage: user["profilePic"],
      };

      res.json(userData);
    } finally {
      await client.close();
    }
  }

  run().catch(console.dir);
});

app.post('/setUserData', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");

    const query = { email: req.body.email };
    const newValues = { $set: { fname: req.body.fname, lname: req.body.lname, profilePic: req.body.photo } };

    await collection.updateOne(query, newValues);
  }
  catch (error) {
    res.status(400).json({ message: error.message })
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
    let games = user["games"];
    games.push({
      "gameID": games.length + 1,
      "opponentName": req.body.opponent,
      "date": req.body.date,
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

app.post('/getGames', async (req, res) => {
  try {
    console.log('CHECKPOINT 1')
    await client.connect();
    console.log('CHECKPOINT 2')
    const collection = client.db("kings-eye").collection("user-database");

    const query = { 
      email: req.body.email,
    };
    console.log('CHECKPOINT 3')

    const user = await collection.findOne(query);
    console.log('CHECKPOINT 4')
    let games = user["games"];

    res.json({ pastGames: games });
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});

engine.postMessage("uci");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/bestMove', (request, response) => {
  engine.onmessage = function (msg) {
    console.log(msg);
    if (response.headersSent) {
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
  engine.postMessage('position fen ' + request.body.fen);
  engine.postMessage('go depth 18');
});

app.post('/evaluateScore', (request, response) => {
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
  engine.postMessage("position fen " + request.body.fen);
  engine.postMessage("go depth 18");
});

app.post('/getPrincipalVariation', (request, response) => {
  let principalVariation = null;
  engine.onmessage = function (msg) {
    console.log(msg);

    const pvMatch = msg.match(/pv\s(.+)/);
    if (pvMatch) {
      principalVariation = pvMatch[1];
    }

    if (msg.startsWith('bestmove') && principalVariation) {
      
      const allElements = principalVariation.split(/\s+/);
      console.log('a', allElements)
      const moves = allElements.slice(11);
      response.send({ moves: moves });
    }
  };

  engine.postMessage('ucinewgame');
  engine.postMessage('position fen ' + request.body.fen);
  engine.postMessage('go depth 18');
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log('Server is listening on', port);
})