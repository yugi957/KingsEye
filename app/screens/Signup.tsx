import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/globalStyles';
// import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [loading, setLoading] = useState(false);

  const navBarHeight = useHeaderHeight();

  const navigation = useNavigation();
  const navToLogin = () => {
    navigation.navigate('Login')
  }

  const signUp = async () => {
    setLoading(true);
    try {
      // Check if all values are provided
      if (!email || !password || !fname || !lname) {
        alert("Please fill all fields");
        return;
      }

      createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);

      let data = { email: email, password: password, fname: fname, lname: lname };
      fetch("https://kingseye-1cd08c4764e5.herokuapp.com/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          // Navigate to Home screen after successful sign-up
          navigation.navigate('Home');
        })
        .catch((error) => console.error('Error:', error));
    } catch (error: any) {
      console.log(error);
      alert("Sign up failed" + error.message);
    } finally {
      setLoading(false);
    }
  }


  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={globalStyles.header}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <TouchableOpacity onPress={navToLogin}>
          <Text style={styles.signupButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView behavior='padding'>
        <TextInput
          placeholder="First Name"
          style={globalStyles.input}
          value={fname}
          placeholderTextColor='#C3C3C3'
          onChangeText={setFname}
        />
        <TextInput
          placeholder="Last Name"
          style={globalStyles.input}
          value={lname}
          placeholderTextColor='#C3C3C3'
          onChangeText={setLname}
        />
        <TextInput
          placeholder="Email"
          style={globalStyles.input}
          value={email}
          placeholderTextColor='#C3C3C3'
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={globalStyles.input}
          secureTextEntry
          value={password}
          placeholderTextColor='#C3C3C3'
          onChangeText={setPassword}
        />
        <TouchableOpacity style={globalStyles.generalButton} onPress={signUp}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingTop: 30,
  },
  signUpText: {
    textAlign: 'center',
    flex: 1,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


