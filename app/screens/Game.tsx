import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import React from 'react';
import Chessboard from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const Game = () => {
  return ( // Try removing GestureHandlerRootView
    <View style={styles.square}>
      <GestureHandlerRootView style={{ flex: 1 }}>
          <Chessboard size={320} />
      </GestureHandlerRootView>
    </View>
  );
};


export default Game;

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  square: {
    width: screenWidth,
    height: screenWidth,
  },
});


const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});