import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../styles/globalStyles';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Signed in');
        } catch (error: any) {
            console.log(error);
            alert("Sign in failed" + error.message);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
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
                {/* <Image source={{ uri: 'URL_TO_YOUR_LOGO' }} style={styles.logo} /> */}
                <Text style={styles.signUpText}>Sign up</Text>
            </View>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput value={email} style={globalStyles.input} onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry value={password} style={globalStyles.input} onChangeText={(text) => setPassword(text)}></TextInput>

                {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
                    <>
                        <TouchableOpacity style={globalStyles.generalButton} onPress={signIn}>
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={globalStyles.generalButton} onPress={signUp}>
                            <Text style={styles.loginButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
        
        // <View style={styles.container}>
        //     <KeyboardAvoidingView behavior='padding'>
        //         <TextInput value={email} style={styles.input} onChangeText={(text) => setEmail(text)}></TextInput>
        //         <TextInput secureTextEntry={true} value={password} style={styles.input} onChangeText={(text) => setPassword(text)}></TextInput>

        //         {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
        //             <>
        //                 <Button title="Sign In" onPress={signIn} />
        //                 <Button title="Sign Up" onPress={signUp} />
        //             </>
        //         )}
        //     </KeyboardAvoidingView>
        // </View>
    );
};

export default Login;

const styles = StyleSheet.create({
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain', // adjust this to your needs
    },
    signUpText: {
        color: 'white',
        fontSize: 16,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});