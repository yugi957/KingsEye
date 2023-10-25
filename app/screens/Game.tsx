import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import ChessBoard from '../components/Chess.tsx';
// import Chessboard from 'react-native-chessboard';


const Game = () => (
  <View style={styles.square}>
    <ChessBoard/>
  </View>
);

export default Game;

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  square: {
    width: screenWidth,
    height: screenWidth,
    backgroundColor: 'blue',  // Optional: for visualization
  },
});
