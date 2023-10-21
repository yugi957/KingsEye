import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH, GOOGLE_PROVIDER } from '../../FirebaseConfig'
import globalStyles from '../styles/globalStyles';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { UserImportBuilder } from 'firebase-admin/lib/auth/user-import-builder';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = getAuth();

    const navigation = useNavigation();
    const navToSignup = () => {
        navigation.navigate('Signup')
    }

    const signIn = async () => {
        setLoading(true);
        try {
            await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            navigation.navigate('Home');
        } catch (error: any) {
            console.log(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={[globalStyles.container, styles.container]}>
            <View style={globalStyles.header}>
                {/* <Image source={{ uri: 'URL_TO_YOUR_LOGO' }} style={styles.logo} /> */}
                <Text style={styles.signInText}>Login</Text>
                <TouchableOpacity onPress={navToSignup}>
                    <Text style={styles.signupButtonText}>Signup</Text>
                </TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior='padding'>
                <TextInput placeholder="Email" placeholderTextColor='#C3C3C3' value={email} style={globalStyles.input} onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput placeholder="Password" placeholderTextColor='#C3C3C3' secureTextEntry value={password} style={globalStyles.input} onChangeText={(text) => setPassword(text)}></TextInput>

                {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
                    <>
                        <TouchableOpacity style={globalStyles.generalButton} onPress={signIn}>
                            <Text style={styles.loginButtonText}>Sign In</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={globalStyles.generalButton} onPress={signUp}>
                            <Text style={styles.loginButtonText}>Sign Up</Text>
                        </TouchableOpacity> */}

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
                                        fetch("https://kingseye-1cd08c4764e5.herokuapp.com/googleLogin", {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({name: result.user.displayName, photo: result.user.photoURL, email: result.user.email})
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                console.log(data);
                                                navigation.navigate('Home');
                                            })
                                            .catch((error) => console.error('Error:', error));
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
    container: {
        paddingBottom: 20,
        paddingTop: 30,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain', // adjust this to your needs
    },
    signInText: {
        textAlign: 'center',
        flex: 1,
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