import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import Board from '../components/Board';
// import Chessboard from 'react-native-chessboard';


const Game = () => (
  <View style={styles.square}>
    <Board/>
  </View>
);

export default Game;

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  square: {
    width: screenWidth,
    height: screenWidth,
  },
});
