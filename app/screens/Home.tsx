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
import { SafeAreaView } from 'react-native-safe-area-context';



const Home = () => {
		const fbAuth = FIREBASE_AUTH;
		const auth = getAuth();
		
		const insets = useSafeAreaInsets();

		const navigation = useNavigation();
		const navToProfile = () => {
			navigation.navigate('Profile');
		}
    const navToGame = () => {
		navigation.navigate('Game');
    }
    const navToCamera = () => {
      navigation.navigate('Camera');
    }
    

    return (
		<View style={[globalStyles.container, styles.container]}>
			{/* Logo and Search */}
			<SafeAreaView style={globalStyles.safeArea}>
				<View style={globalStyles.header}>
					<View style={styles.profileImagePlaceholder}></View>
					<Text style={styles.title}>Game Archive</Text>
					<TouchableOpacity onPress={navToProfile}>
						<Image source={profileImage} style={styles.profileImageStyle}></Image>
					</TouchableOpacity>
        		</View>
          	</SafeAreaView>
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

			{/* Play Button */}
      <SafeAreaView style={globalStyles.safeArea}>
			<TouchableOpacity style={[globalStyles.generalButton, styles.playButton]} onPress={navToCamera}>
			<Text style={styles.playButtonText}>Take Picture</Text>
			</TouchableOpacity>
      </SafeAreaView>
		</View>
		
      );
};

export default Home;

const styles = StyleSheet.create({
    container: {
      padding: 0,
      // paddingBottom: 20,
      // paddingTop: 30,
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
        height: 24,
        marginRight: 10,
    },
    profileImagePlaceholder: {
      width: 24,
      height: 24,
      marginRight: 10,
      opacity: 0, // make the placeholder invisible
    },
  });
  