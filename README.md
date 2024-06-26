# KingsEye

### Demo
[![King's Eye Demo](https://github.com/yugi957/KingsEye/assets/74220837/1a6090ba-dbec-4dd8-a27e-4b79d195942e)](https://drive.google.com/file/d/1rVLODHcqqeoMd1b_u2NQpbmCA7T3kGP_/view?usp=sharing)

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
- curl "https://kingseye-1cd08c4764e5.herokuapp.com/bestMove?fen=rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R%20b%20-%20-%200%2014"
> This outputs {"firstMove":"b8c6","secondMove":"b1c3"}

### Get Evaluation Score
- curl "https://kingseye-1cd08c4764e5.herokuapp.com/evaluationScore?fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR%20w%20KQkq%20-%200%201"
> This outputs {"evaluation": 17}, meaning white is at advantage. Negative score would mean black is at advantage

- curl "https://kingseye-1cd08c4764e5.herokuapp.com/evaluationScore?fen=8/8/8/8/8/7R/6RK/6k1%20b%20-%20-%200%201"
> This outputs {"evaluation": 'Mate in -2'}, negative meaning black

### Get Principal Variation
- curl "https://kingseye-1cd08c4764e5.herokuapp.com/principalVariation?fen=r4rk1/p2qn1pp/2pbbp2/3pp3/4P3/Q1Nn1N2/P1PBBPPP/R4RK1%20w%20-%20-%200%2014"
> Gives optimal moves for a bunch of turns. First 2 moves should always be same as the /bestMove api call
```{"moves":["a3a5","d3c5","d2c1","d5d4","c3a4","c5e4","f3d2","e4d2","c1d2","d6c7","a5a6","d7d6","d2a5","c7b6","a5d2","e7d5","a6d3","b6c7","c2c4","d5f4","d2f4","e5f4","a1b1"]}```
