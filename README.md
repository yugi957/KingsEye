# KingsEye

### Install Dependencies
- Node.js
- Express & Expo
- install node packages ```npm install```
- Firebase packages: ```npx expo install firebase```

### Important Note:
- server.js depends on npm stockfish library. Due to poor maintanence though, it seems that a file is missing from ```npm install```.
- To remedy this, the file ```stockfish.js``` must be copied into ```node_modules/stockfish/src```

## How to run
- ```npx expo start```
> Might ask to install expo, say yes
- You can scan the qr code on your phone to view development that way, or install an emulator (ios, android), or view on web
> To run from web, install web package: ```npx expo install react-native-web@~0.19.6 react-dom@18.2.0 @expo/webpack-config@^19.0.0```

### Our server url:
- ```https://kingseye-1cd08c4764e5.herokuapp.com/```

## Stockfish commands (curl calls)
### Get next bext moves
- curl -X POST https://kingseye-1cd08c4764e5.herokuapp.com/bestmove \
-H "Content-Type: application/json" \
-d '{"fen": "rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b - - 0 14"}'
> This outputs {"firstMove":"b8c6","secondMove":"b1c3"}
### Get EV Score
- curl -X POST https://kingseye-1cd08c4764e5.herokuapp.com/evaluateScore \
-H "Content-Type: application/json" \
-d '{"fen": "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"}'
> This outputs {"evaluation": 17}, meaning white is at advantage. Negative score would mean black is at advantage

- curl -X POST https://kingseye-1cd08c4764e5.herokuapp.com/evaluateScore \
-H "Content-Type: application/json" \
-d '{"fen": "8/8/8/8/8/7R/6RK/6k1 b - - 0 1"}'
> This outputs {"evaluation": 'Mate in -2'}, negative meaning black

### Get Principal Variation
- curl -X POST https://kingseye-1cd08c4764e5.herokuapp.com/getPrincipalVariation \
-H "Content-Type: application/json" \
-d '{"fen": "r4rk1/p2qn1pp/2pbbp2/3pp3/4P3/Q1Nn1N2/P1PBBPPP/R4RK1 w - - 0 14"}'
> Gives optimal moves for a bunch of turns. First 2 moves should always be same as the /bestMove api call