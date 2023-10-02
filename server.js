const axios = require('axios');

const express = require("express");
const stockfish = require("stockfish");
const engine = stockfish();
const app = express();
const port = process.env.PORT || 5000;

const fenregex = "/^([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s(0|[1-9][0-9]*)\s([1-9][0-9]*)/"

engine.onmessage = function(msg) {
  console.log(msg);
};

engine.postMessage("uci");

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.post('/', (request, response) => {

  // if (!request.body.fen.match(fenregex)) {
  //   response.send("Invalid fen string");
  //   return;
  // }
  
// if chess engine replies
  engine.onmessage = function(msg) {
    console.log(msg);
    // in case the response has already been sent?
    if (response.headersSent) {
        return;
    }
    // only send response when it is a recommendation
    if (typeof(msg == "string") && msg.match("bestmove")) {
        response.send(msg);
    }
  }

// run chess engine
  engine.postMessage("ucinewgame");
  engine.postMessage("position fen " + request.body.fen);
  engine.postMessage("go depth 18");
});

// // Define a ping/health-check route
// app.get('/api', (req, res) => {
//   res.json({ message: 'Connection to the backend is working!' });
// });

// FEN TEST
axios.post('http://localhost:5000', {
  fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 1'
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error(error);
});

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});