import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH, GOOGLE_PROVIDER, MICROSOFT_PROVIDER } from '../../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import globalStyles from '../styles/globalStyles';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const fbAuth = FIREBASE_AUTH;
    const auth = getAuth();

    const navigation = useNavigation();
    const navToSignup = () => {
        navigation.navigate('Signup')
    }

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(fbAuth, email, password);
            console.log(response);
            alert('Signed in');
            navigation.navigate('Home')
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
                {/* <Image source={{ uri: 'URL_TO_YOUR_LOGO' }} style={styles.logo} /> */}
                <Text style={styles.signUpText}>Sign In</Text>
                <TouchableOpacity onPress={navToSignup}>
                    <Text style={styles.signupButtonText}>Signup</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput placeholder="Username" placeholderTextColor="#C3C3C3" value={email} style={globalStyles.input} onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput placeholder="Password" placeholderTextColor="#C3C3C3" secureTextEntry value={password} style={globalStyles.input} onChangeText={(text) => setPassword(text)}></TextInput>

                {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
                    <>
                        <TouchableOpacity style={globalStyles.generalButton} onPress={signIn}>
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={globalStyles.generalButton} onPress={signUp}>
                            <Text style={styles.loginButtonText}>Sign Up</Text>
                        </TouchableOpacity>

                        {/* sign in with google */}
                        <TouchableOpacity
                            style={globalStyles.generalButton}
                            onPress={() => {
                                signInWithPopup(auth, GOOGLE_PROVIDER)
                                    .then((result) => {
                                        // This gives you a Google Access Token. You can use it to access the Google API.
                                        const credential = GoogleAuthProvider.credentialFromResult(result);
                                        if (credential) {
                                            const token = credential.accessToken;
                                        }
                                        // The signed-in user info.
                                        const user = result.user;
                                        // IdP data available using getAdditionalUserInfo(result)
                                        // ...
                                    })
                                    .catch((error) => {
                                        // Handle Errors here.
                                        const errorCode = error.code;
                                        const errorMessage = error.message;
                                        // The email of the user's account used.
                                        const email = error.customData.email;
                                        // The AuthCredential type that was used.
                                        const credential = GoogleAuthProvider.credentialFromError(error);
                                        // ...
                                    });
                            }}
                        >
                            <Text style={styles.loginButtonText}>Sign In With Google</Text>
                        </TouchableOpacity>

                        {/* sign in with microsoft */}
                        <TouchableOpacity
                            style={globalStyles.generalButton}
                            onPress={() => {
                                signInWithPopup(auth, MICROSOFT_PROVIDER)
                                    .then((result) => {
                                        // User is signed in.
                                        // IdP data available in result.additionalUserInfo.profile.

                                        // Get the OAuth access token and ID Token
                                        const credential = OAuthProvider.credentialFromResult(result);
                                        if (credential) {
                                            const accessToken = credential.accessToken;
                                            const idToken = credential.idToken;
                                        }
                                    })
                                    .catch((error) => {
                                        // Handle error.
                                    });
                            }}
                        >
                            <Text style={styles.loginButtonText}>Sign In With Microsoft</Text>
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
        textAlign: 'center',
        flex:1,
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',  
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    
});