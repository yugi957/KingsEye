import { View, Modal, TextInput, StyleSheet, Button, Text, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react'
import { FIREBASE_AUTH, GOOGLE_PROVIDER } from '../../FirebaseConfig'
import globalStyles from '../styles/globalStyles';
import { getAuth, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { UserImportBuilder } from 'firebase-admin/lib/auth/user-import-builder';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { StatusBar } from 'expo-status-bar';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetEmail, setResetEmail] = React.useState('');
    const [isModalVisible, setIsModalVisible] = React.useState(false);
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

    const handleForgotPassword = () => {
        setIsModalVisible(true);
    };

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
                <TextInput placeholder="Email" placeholderTextColor='#C3C3C3' autoCapitalize="none" value={email} style={globalStyles.input} onChangeText={(text) => setEmail(text)}></TextInput>
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
                                            body: JSON.stringify({ name: result.user.displayName, photo: result.user.photoURL, email: result.user.email })
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
                <Text style={styles.forgotPassword} onPress={handleForgotPassword}>Forgot your password?</Text>
            </KeyboardAvoidingView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                setIsModalVisible(!isModalVisible);
                            }}
                        >
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalText}>Enter your email to reset your password</Text>
                        <TextInput
                            style={styles.signInText}
                            placeholder="Email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onChangeText={setResetEmail}
                        />
                        <TouchableOpacity style={styles.passButton}
                            onPress={() => {
                                sendPasswordResetEmail(getAuth(), resetEmail);
                                alert('Email sent');
                                setIsModalVisible(!isModalVisible);
                            }}>
                            <Text>Send email</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
    passButton: {
        backgroundColor: "#88ac4c"
    },
    closeButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        padding: 10,
    },
    closeButtonText: {
        fontSize: 20,
        color: 'white',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "#2e2e2e",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        color: "white"
    },
    signInText: {
        height: 40,
        width: 220,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        color: "white"
    },
    container: {
        paddingBottom: 20,
        paddingTop: 30,
    },
    forgotPassword: {
        textDecorationLine: 'underline',
        color: 'white',
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