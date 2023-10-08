const axios = require('axios');
const express = require("express");
const stockfish = require("stockfish");
const engine = stockfish();
const app = express();
var http = require('http');
const port = process.env.PORT || 5000;

const fenregex = "/^([rnbqkpRNBQKP1-8]+\/){7}([rnbqkpRNBQKP1-8]+)\s[bw]\s(-|K?Q?k?q?)\s(-|[a-h][36])\s(0|[1-9][0-9]*)\s([1-9][0-9]*)/"

// app.get('/', (req, res) => {
//   res.send('Its Chess World!')
// })

engine.onmessage = function(msg) {
  console.log(msg);
};

engine.postMessage("setoption name MultiPV value 3");
engine.postMessage("uci");

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// Receive request to calculate a best move
app.post('/bestmove', (request, response) => {
  
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
  engine.postMessage("go depth 10");
});

app.listen(port, (err) => {
  if (err) {
    return console.log('Something bad happened', err);
  }
  console.log('Server is listening on', port);
})