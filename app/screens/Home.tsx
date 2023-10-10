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
        <View style={[globalStyles.container, styles.container]}>
          {/* Logo and Search */}
          <View style={[globalStyles.header, styles.header]}>
            <Text style={styles.title}>Game Archive</Text>
          </View>
    
          {/* Game Archive List */}
          <ScrollView style={styles.archiveList}>
            {Array(10).fill(null).map((_, index) => (
              <TouchableOpacity key={index} style={styles.opponentItem}>
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
          <TouchableOpacity style={[globalStyles.generalButton, styles.playButton]}>
            <Text style={styles.playButtonText}>Take Picture</Text>
          </TouchableOpacity>
        </View>
      );
};

export default Home;

const styles = StyleSheet.create({
    container: {
      padding: 0,
      paddingBottom: 20
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
  });
  