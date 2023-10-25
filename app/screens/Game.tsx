import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import Chessboard from 'react-native-chessboard';

const Game = () => (
  <View
    style={{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center'
    }}
  >
    <Chessboard/>
  </View>
);
// const Game = () => (
//   <View></View>
// );

// import { Chess } from 'chess.js';
// const chess = new Chess();

export default Game;