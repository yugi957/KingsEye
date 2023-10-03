import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import globalStyles from '../styles/globalStyles';

const Home = () => {
    const fbAuth = FIREBASE_AUTH;
    const auth = getAuth();
    
    return (
        <View style={globalStyles.container}>
          {/* Logo and Search */}
          <View style={globalStyles.header}>
            <Text style={styles.logo}>INSERT LOGO HERE</Text>
          </View>
    
          {/* Game Archive List */}
          <ScrollView style={styles.archiveList}>
            {Array(10).fill(null).map((_, index) => (
              <View key={index} style={styles.opponentItem}>
                <Text style={styles.opponentName}>Opponent Name</Text>
                <TouchableOpacity style={styles.iconButton}>
                  {/* Representing icons with text here; replace with actual icons */}
                  <Text>{['+', '-', '='][index % 3]}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
    
          {/* Play Button */}
          <TouchableOpacity style={globalStyles.generalButton}>
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
        </View>
      );
};

export default Home;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      padding: 15,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      flex: 1,
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
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
      marginBottom: 10,
    },
    opponentName: {
      flex: 1,
      color: 'white',
      fontSize: 18,
    },
    iconButton: {
      width: 30,
      height: 30,
      backgroundColor: 'gray',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 15,
      marginLeft: 10,
    },
    playButton: {
      backgroundColor: 'green',
      borderRadius: 20,
      paddingVertical: 10,
      alignItems: 'center',
    },
    playButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
  });
  