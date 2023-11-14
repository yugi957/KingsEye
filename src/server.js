const axios = require('axios');
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

const fenregex = "/^([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s(0|[1-9][0-9]*)\s([1-9][0-9]*)/"

console.log('foo bar')

// const app = express();
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
  const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
  const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
  const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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

      // Move res.json(userData); here
      res.json(userData);
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  run().catch(console.dir);
});


app.post('/setUserData', async (req, res) => {
  const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");

    const query = { email: req.body.email };
    const newValues = { $set: { fname: req.body.fname, lname: req.body.lname, profilePic: req.body.photo } };

    const result = await collection.updateOne(query, newValues);

    if (result.modifiedCount > 0) {
      res.send(`User ${req.body.email} updated`);
    } else {
      res.status(400).send(`User ${req.body.email} not found`);
    }
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});

app.post('/saveGame', async (req, res) => {
  const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");

    const query = { 
      email: req.body.email,
    };

    const user = await collection.findOne(query);
    let games = user["games"];
    const game_id = games.length + 1;
    const new_games = games.push({
      "gameID": game_id,
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
    res.send({ message: "Game saved successfully" });
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});

app.post('/setUserData', async (req, res) => {
  const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");

    const query = { email: req.body.email };
    const newValues = { $set: { fname: req.body.fname, lname: req.body.lname, profilePic: req.body.photo } };

    const result = await collection.updateOne(query, newValues);

    if (result.modifiedCount > 0) {
      res.send(`User ${req.body.email} updated`);
    } else {
      res.status(400).send(`User ${req.body.email} not found`);
    }
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});

app.post('/getGames', async (req, res) => {
    console.log('CHECKPOINT 0')
    const uri = "mongodb+srv://local_kings_eye:BlbbhGACvgksJqL5@kings-eye.ouonoms.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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
    // res.send({ message: "Games retrieved" });
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});

engine.postMessage("uci");

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Receive request to calculate a best move
app.post('/bestmove', (request, response) => {

  // if chess engine replies
  engine.onmessage = function (msg) {
    console.log(msg);
    // in case the response has already been sent?
    if (response.headersSent) {
      return;
    }
    // only send response when it is a recommendation
    if (typeof (msg == "string") && msg.match("bestmove")) {
      response.send(msg);
    }
  }

  // run chess engine
  engine.postMessage("ucinewgame");
  engine.postMessage("position fen " + request.body.fen);
  engine.postMessage("go depth 18");
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log('Server is listening on', port);
})