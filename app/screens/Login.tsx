import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH, GOOGLE_PROVIDER } from '../../FirebaseConfig'
import globalStyles from '../styles/globalStyles';
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';


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
            let url = "https://kingseye-1cd08c4764e5.herokuapp.com/login";
            let data = { email: email, password: password };
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Sign-in failed");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log(data);
                    // Navigate to Home screen after successful sign-up
                    navigation.navigate('Home');
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert(error.message);
                });
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
                <TextInput placeholder="Username" placeholderTextColor='#C3C3C3' value={email} style={globalStyles.input} onChangeText={(text) => setEmail(text)}></TextInput>
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
                                        // The signed-in user info.
                                        const user = result.user;
                                        // IdP data available using getAdditionalUserInfo(result)
                                        // ...
                                        // Navigate to Home screen after successful sign-in
                                        navigation.navigate('Home');
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