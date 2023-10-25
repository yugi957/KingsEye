import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import globalStyles from '../styles/globalStyles';
import profileImage from '../../assets/profile.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const Home = () => {
		const fbAuth = FIREBASE_AUTH;
		const auth = getAuth();
		
		const [hasCameraPermission, setHasCameraPermission] = useState(false);
		const [showCamera, setShowCamera] = useState(false);
		const [capturedImage, setCapturedImage] = useState(null);
		const cameraRef = useRef(null);

		useEffect(() => {
		  (async () => {
			const { status } = await Permissions.askAsync(Permissions.CAMERA);
			setHasCameraPermission(status === 'granted');
		  })();
		}, []);
		if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		}
		const handleTakePicture = async () => {
			if (cameraRef.current) {
			  const options = { quality: 0.5, base64: true };
			  const data = await cameraRef.current.takePictureAsync(options);
			  setCapturedImage(data.uri);
			  setShowCamera(false);
			}
		};
		const handleAcceptPicture = () => {
			// @qazx: do something with the captured image
			setCapturedImage(null);
		};
		const handleRetakePicture = () => {
			setCapturedImage(null);
			setShowCamera(true);
		};
		const handleCancelPicture = () => {
			setCapturedImage(null);
			setShowCamera(false);
		};
		const insets = useSafeAreaInsets();

		const navigation = useNavigation();
		const navToProfile = () => {
			navigation.navigate('Profile');
		}
    const navToGame = () => {
		navigation.navigate('Game');
    }
    
		const cameraView = (
			<View style={{ flex: 1 }}>
			  <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} ref={cameraRef}>
				<View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
				  <TouchableOpacity style={{ flex: 0.1, alignSelf: 'flex-end', alignItems: 'center' }} onPress={handleCancelPicture}>
					<Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Cancel </Text>
				  </TouchableOpacity>
				  <TouchableOpacity style={{ flex: 0.8, alignSelf: 'flex-end', alignItems: 'center' }} onPress={handleTakePicture}>
					<Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Take Picture </Text>
				  </TouchableOpacity>
				  <TouchableOpacity style={{ flex: 0.1, alignSelf: 'flex-end', alignItems: 'center' }} onPress={handleRetakePicture}>
					<Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Retake </Text>
				  </TouchableOpacity>
				</View>
			  </Camera>
			</View>
		  );
		  
		const pictureView = (
		<View style={{ flex: 1 }}>
			<Image source={{ uri: capturedImage }} style={{ flex: 1 }} resizeMode="contain" />
			<View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
			<TouchableOpacity style={[globalStyles.generalButton, { backgroundColor: 'green' }]} onPress={handleAcceptPicture}>
				<Text style={styles.buttonText}>Accept</Text>
			</TouchableOpacity>
			<TouchableOpacity style={[globalStyles.generalButton, { backgroundColor: 'red' }]} onPress={handleRetakePicture}>
				<Text style={styles.buttonText}>Retake</Text>
			</TouchableOpacity>
			</View>
		</View>
		);

    return (
        <View style={[globalStyles.container, styles.container]}>
          {/* Logo and Search */}
          <View style={[globalStyles.header, styles.header]}>
            <Text style={styles.title}>Game Archive</Text>
            <TouchableOpacity onPress={navToProfile}>
                <Image source={profileImage} style={styles.profileImageStyle}></Image>
            </TouchableOpacity>
          </View>
    
          {/* Game Archive List */}
          <ScrollView style={styles.archiveList}>
            {Array(10).fill(null).map((_, index) => (
              <TouchableOpacity key={index} style={styles.opponentItem} onPress={navToGame}>
                <Text style={styles.opponentName}>Opponent Name</Text>
                {index%3 == 0 && (
                    <View style={[styles.icon, styles.green]}>
                        <Text>+</Text>
                    </View>
                )}
                {index%3 == 1 && (
                    <View style={[styles.icon, styles.red]}>
                        <Text>-</Text>
                    </View>
                )}
                {index%3 == 2 && (
                    <View style={styles.icon}>
                        <Text>=</Text>
                    </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

		  {/* Camera */}
		  <Camera style={{ flex: 1 }} type={Camera.Constants.Type.back} />

          {/* Play Button */}
          {showCamera ? cameraView : capturedImage ? pictureView : (
        <TouchableOpacity style={[globalStyles.generalButton, styles.playButton]} onPress={() => setShowCamera(true)}>
          <Text style={styles.playButtonText}>Take Picture</Text>
        </TouchableOpacity>
		  )}
		</View>
		
      );
};

export default Home;

const styles = StyleSheet.create({
    container: {
      padding: 0,
      paddingBottom: 20,
      paddingTop: 30,
    },
    header: {
      padding: 25,
      marginBottom: 0,
      alignItems: 'center'
    },
    title: {
      flex: 1,
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center'
    },
    search: {
      flex: 2,
      backgroundColor: 'gray',
      borderRadius: 15,
      paddingHorizontal: 15,
      color: 'white',
    },
    archiveList: {
      flex: 1,
      marginBottom: 20,
    },
    opponentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 5,
      paddingTop: 5,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#24231f",
    },
    opponentName: {
      flex: 1,
      color: 'white',
      fontSize: 18,
    },
    icon: {
      width: 30,
      height: 30,
      backgroundColor: 'gray',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      marginLeft: 10,
    },
    green: {
        backgroundColor: '#90b35a'
    },
    red: {
        backgroundColor: '#c44542'
    },
    playButton: {
      margin: 20
    },
    playButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    profileImageStyle: {
        width: 24,
        height: 24
    },
  });
  