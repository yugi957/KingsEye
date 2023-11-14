import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Chessboard from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Confirmation({ navigation }) {
  const [fen, setFen] = useState('rn1qkbnr/pppb1Qpp/3p4/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4');

  const handleAccept = () => {
    navigation.navigate('NextScreenOnAccept');
  };

  const handleReject = () => {
    navigation.navigate('NextScreenOnReject');
  };

  return (
    <View style={styles.container}>
    <GestureHandlerRootView style={{ flex: 1, paddingTop: 40 }}>
        <Chessboard fen={fen} colors={{black: "#769656", white: "#eeeed2"}}/>
    </GestureHandlerRootView>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleReject} style={styles.button}>
          {/* <Text style={styles.buttonText}>Reject</Text> */}
          <Image style={{width: 100, height:100}} source={require('../../assets/rejectImage.png')} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleAccept} style={styles.button}>
          {/* <Text style={styles.buttonText}>Accept</Text> */}
          <Image style={{width: 100, height:100}} source={require('../../assets/acceptImage.png')} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E2E2E',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 5,
  },
  rejectButton: {
    backgroundColor: 'red', // example color
  },
  acceptButton: {
    backgroundColor: 'green', // example color
  },
  buttonText: {
    color: '#fff',
  },
});
