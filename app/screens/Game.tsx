import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Chessboard, {ChessboardRef } from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import globalStyles from '../styles/globalStyles';


const Game = () => {
  let gameObj = {
    "gameId": 1,
    "opponentName": "Dhruv Agarwal",
    "date": "2023/05/11",
    "moves": [
      "rnbqkbnr/pp2pppp/3p4/2p5/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 1 3",
      "rnbqkb1r/pp2pppp/3p1n2/2p5/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 2 4",
      "rnbqkb1r/pp2pppp/3p1n2/2p5/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 3 4"
    ]
  }
  const [fen, setFen] = useState(gameObj.moves[0]);
  const [fenHistory, setFenHistory] = useState(gameObj.moves);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const chessboardRef = useRef<ChessboardRef>(null);

  const onMove = ({state}) => {
    console.log(state);
    console.log(fenHistory, currentMoveIndex);
    // Update the FEN history by removing FENs after the current index and appending the new FEN
    const newHistory = fenHistory.slice(0, currentMoveIndex + 1);
    newHistory.push(state.fen);
    
    setFenHistory(newHistory);
    setCurrentMoveIndex(newHistory.length - 1); // Update the current index
    setFen(state.fen); // Update the current FEN

    console.log(fenHistory, currentMoveIndex);
  };

  // Function to undo the last move
  const undoMove = () => {
    console.log(fenHistory, currentMoveIndex);
    if (currentMoveIndex > 0) {
      setCurrentMoveIndex(currentMoveIndex - 1);
      setFen(fenHistory[currentMoveIndex - 1]);
    }
    console.log(fenHistory, currentMoveIndex);
  };

  // Function to redo the last undone move
  const redoMove = () => {
    console.log(fenHistory, currentMoveIndex);
    if (currentMoveIndex < fenHistory.length - 1) {
      setCurrentMoveIndex(currentMoveIndex + 1);
      setFen(fenHistory[currentMoveIndex + 1]);
    }
    console.log(fenHistory, currentMoveIndex);
  };

  useEffect(() => {
    chessboardRef?.current?.resetBoard(fen);
    fetch('http://10.0.2.2:3000/bestmove', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ fen: fen }),
		})
			.then(response => response.text())
      .then(data => {console.log("BESTMOVE", data)})
			.catch(error => console.error('Error:', error));
  }, [fen]);

  return ( // Try removing GestureHandlerRootView
    <View style={[styles.square]}>
      <GestureHandlerRootView style={{ flex: 1, paddingTop:40 }}>
        <Chessboard
          // key={fen}
          fen={fen}
          onMove={onMove}
          ref={chessboardRef}
        />
      </GestureHandlerRootView>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={undoMove}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={redoMove}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default Game;

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  square: {
    // width: screenWidth,
    // height: screenWidth,
    backgroundColor: '#2E2E2E',
    flex: 1, 
    // alignItems: 'center',
    justifyContent: 'center'
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#000',
    marginHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
  },
});