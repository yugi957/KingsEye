import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import Chessboard from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeIcon from '../../assets/homeIcon.png';

export default function Confirmation({ navigation }) {
  const [fen, setFen] = useState('rn1qkbnr/pppb1Qpp/3p4/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4');


	const navToHome = () => {
		navigation.navigate('Home')
	}
  
  const handleAccept = () => {
    navigation.navigate('Game', { item: {
      "gameId": 1,
      "opponentName": "Dhruv Agarwal",
      "date": "2023/05/11",
      "moves": [
        fen
      ]
    } })
  };

  const handleReject = () => {
    navigation.navigate('Camera');
  };

  return (
    <SafeAreaView style={styles.container}>
    <View style={styles.container}>
    <TouchableOpacity onPress={navToHome}>
					<Image source={HomeIcon} style={styles.IconStyle} />
				</TouchableOpacity>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  confirmText: {
		textAlign: 'center',
		flex: 1,
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
	},
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
  IconStyle: {
		width: 30,
		height: 30,
		marginLeft: 10,
	},
});
