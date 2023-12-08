import React, { useState } from 'react';
import { View, Image, Text, TextInput, Button, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import globalStyles from '../styles/globalStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import Logo from "../../assets/KING'S-EYE-LOGO-2.png";

const screenWidth = Dimensions.get('window').width;
const logoSize = screenWidth * .8;

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

      let data = { email: email, password: password, fname: fname, lname: lname };

      // Send a POST request to the server
      let response = await fetch("https://kingseye-1cd08c4764e5.herokuapp.com/signUp", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      // Check if the server responded with an error
      if (!response.ok) {
        throw new Error('Server responded with an error');
      }

      // Create the user in Firebase
      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);

      // Navigate to the home page
      navigation.navigate('Home');
    } catch (error: any) {
      console.log(error);
      alert("Sign up failed" + error.message);
    } finally {
      setLoading(false);
    }
  };



  return (
	<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
		<View style={[globalStyles.container, styles.container]}>
			<SafeAreaView style={globalStyles.safeArea}>
		<View style={globalStyles.header}>
		<View style={{ width: 50, height: 50 }} />
			<Text style={styles.signUpText}>Sign Up</Text>
			<TouchableOpacity onPress={navToLogin}>
			<Text style={styles.signupButtonText}>Login</Text>
			</TouchableOpacity>
		</View>
    <Image source={Logo} style={styles.logoStyling}/>
		</SafeAreaView>
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
			autoCapitalize="none"
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
		</TouchableWithoutFeedback>
  );
};

export default Signup;

const styles = StyleSheet.create({
  logoStyling: {
    width: logoSize,
    height: 150,
    resizeMode: 'contain', 
    paddingBottom: 50,
    alignSelf: 'center',
  },
	container: {
		// paddingBottom: 10,
		paddingTop: 0,
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


