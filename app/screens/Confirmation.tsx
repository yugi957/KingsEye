import { View, TouchableOpacity, Image, Text, StyleSheet, Dimensions } from 'react-native';
import globalStyles from '../styles/globalStyles';
import HomeButton from '../components/HomeButton';
import React, { useState } from 'react';
import Chessboard from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeIcon from '../../assets/homeIcon.png';


const screenWidth = Dimensions.get('window').width;
const buttonSize = screenWidth * 0.2;

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
	<View style={[globalStyles.container, styles.container]}>
    <SafeAreaView style={globalStyles.safeArea}>
	<View style={globalStyles.header}>
           <HomeButton navigation={navigation} onCustomPress={undefined} />
           <Text style={styles.confirmText}>Confirmation</Text>
           <View style={styles.IconStyleTransparent}></View>
	</View>
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Chessboard fen={fen} colors={{black: "#769656", white: "#eeeed2"}}/>
    </GestureHandlerRootView>
	<View style={styles.buttonHorizontal}>
          <View style={styles.buttonVertical}>
            <TouchableOpacity onPress={handleReject}>
              <Image style={styles.buttonImage} source={require('../../assets/rejectImage.png')} />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Cancel</Text>
          </View>
          <View style={styles.buttonVertical}>
            <TouchableOpacity onPress={handleAccept}>
              <Image style={styles.buttonImage} source={require('../../assets/acceptImage.png')} />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Approve</Text>
          </View>
        </View>
    </SafeAreaView>
	</View>
  );
}

const styles = StyleSheet.create({
	buttonHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    buttonVertical: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 10,
    },
	confirmText: {
		textAlign: 'center',
		flex: 1,
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
	},
	container: {
		// flex: 1,
		alignItems: 'center',
		// justifyContent: 'center',
		// backgroundColor: '#2E2E2E',
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
	buttonText: {
		paddingLeft: 5,
		// paddingRight: 5,
		paddingBottom: 10,
		alignItems: 'center',
		margin:5,
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	IconStyle: {
		width: 30,
		height: 30,
		marginLeft: 10,
	},
	IconStyleTransparent: {
		width: 30,
		height: 30,
	},
	buttonImage: {
        width: buttonSize,
        height: buttonSize,
	},
});
