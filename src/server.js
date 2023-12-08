const express = require("express");
const stockfish = require("stockfish");
const engine = stockfish();
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const basePfp = require('../assets/base64data_js');

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

app.post('/signUp', async (req, res) => {
  try {
    await client.connect();
    await client.db("kings-eye").collection("user-database").insertOne(
      {
        email: req.body.email,
        id: stringToHash(req.body.email),
        fname: req.body.fname,
        lname: req.body.lname,
        profilePic: basePfp,
        games: []
      });

    await client.close();
    res.json({ message: 'Data received!' });
  } catch (err) {
    console.error(err);
  }
});

app.delete('/deleteAccount', async (req, res) => {
  try {
    await client.connect();
    const result = await client.db("kings-eye").collection("user-database").deleteOne({
      email: req.body.email
    });

    await client.close();

    if (result.deletedCount === 0) {
      res.json({ message: 'No account found with the provided email/id.' });
    } else {
      res.json({ message: 'Account deleted successfully.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting account.' });
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

app.post('/setUserData', async (req, res) => {
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
    let games = user["games"];
    games.push({
      "gameID": games.length + 1,
      "opponentName": req.body.opponent,
      "date": req.body.date,
      "title": req.body.title,
      "starred": false,
      "moves": [],
      "status": req.body.status,
      "side": req.body.side,
      "notes": req.body.notes
    });

    const updateQuery = {
      $set: {
        games: games
      }
    };

    await collection.updateOne(query, updateQuery);

    res.status(200).json({ message: 'Game saved successfully' });
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
});

app.patch('/updateGame', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");
    const userEmail = req.body.email;
    const gameIdToUpdate = req.body.gameID;
    const user = await collection.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const gameIndex = user.games.findIndex(game => game.gameID === gameIdToUpdate);
    
    if (gameIndex === -1) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const updateQuery = { $set: {} };
    if ('moves' in req.body) {
      updateQuery.$set[`games.${gameIndex}.moves`] = req.body.moves;
    }
    if ('opponentName' in req.body) {
      updateQuery.$set[`games.${gameIndex}.opponentName`] = req.body.opponentName;
    }
    if ('title' in req.body) {
      updateQuery.$set[`games.${gameIndex}.title`] = req.body.title;
    }
    if ('starred' in req.body) {
      updateQuery.$set[`games.${gameIndex}.starred`] = req.body.starred;
    }
    if ('status' in req.body) {
      updateQuery.$set[`games.${gameIndex}.status`] = req.body.status;
    }
    if ('notes' in req.body) {
      updateQuery.$set[`games.${gameIndex}.notes`] = req.body.notes;
    }
    if (Object.keys(updateQuery.$set).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }
    await collection.updateOne({ email: userEmail }, updateQuery);

    res.status(200).json({ message: 'Game updated successfully' });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
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

app.delete('/deleteGame', async (req, res) => {
  try {
    await client.connect();
    const collection = client.db("kings-eye").collection("user-database");
    const userEmail = req.body.email;
    const gameIdToDelete = req.body.gameID;
    const user = await collection.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const updatedGames = user.games.filter(game => game.gameID !== gameIdToDelete);
    if (updatedGames.length === user.games.length) {
      return res.status(404).json({ message: 'Game not found' });
    }
    const updateQuery = {
      $set: {
        games: updatedGames
      }
    };
    await collection.updateOne({ email: userEmail }, updateQuery);
    res.status(200).json({ message: 'Game deleted successfully' });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
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
  engine.postMessage('debug off');
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


module.exports = app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log('Server is listening on', port);
})
