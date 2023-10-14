import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator,  KeyboardAvoidingView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH} from '../../FirebaseConfig'
import { getAuth }from "firebase/auth";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../styles/globalStyles';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const fbAuth = FIREBASE_AUTH;
    const auth = getAuth();

    const navigation = useNavigation();
    const navToLogin = () => {
        navigation.navigate('Login')
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(fbAuth, email, password);
            console.log(response);
            alert('Account created');
        } catch (error: any) {
            console.log(error);
            alert("Sign up failed" + error.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={styles.signUpText}>Sign Up</Text>
        <TouchableOpacity onPress={navToLogin}>
                    <Text style={styles.signupButtonText}>Login</Text>
                </TouchableOpacity>
      </View>
    <KeyboardAvoidingView behavior='padding'>
        <TextInput
            placeholder="Username"
            style={globalStyles.input}
            value={email}
            onChangeText={setEmail}
        />
        <TextInput
            placeholder="Password"
            style={globalStyles.input}
            secureTextEntry
            value={password}
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
  signUpText: {
    textAlign: 'center',
    flex:1,
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


