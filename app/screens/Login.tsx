import { Alert, Image, Dimensions, View, TextInput, StyleSheet, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import globalStyles from '../styles/globalStyles';
import { signInWithEmailAndPassword } from "firebase/auth";
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendPasswordResetEmail } from "firebase/auth";
import Logo from "../../assets/KING'S-EYE-LOGO-2.png";

const screenWidth = Dimensions.get('window').width;
const logoSize = screenWidth * .8;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const navigation = useNavigation();
    const navToSignup = () => {
        navigation.navigate('Signup')
    }

    useFocusEffect(
        React.useCallback(() => {
          setEmail('');
          setPassword('');
        }, [])
      );
    

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

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(!showForgotPassword);
        showPasswordForgotConfirmation();
    };

    const showPasswordForgotConfirmation = () => {
        Alert.prompt(
            "Reset Password",
            "Enter your email to reset your password",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "destructive"
                },
                {
                    text: "Send Email",
                    onPress: async (email) => {
                        if (email) {
                            try {
                                await sendPasswordResetEmail(FIREBASE_AUTH, email);
                                Alert.alert("Password Reset", "Password reset email sent successfully.");
                            } catch (error) {
                                console.error("Password Reset Error", error);
                                Alert.alert("Error", error.message);
                            }
                        }
                    }
                }
            ],
            'plain-text'
        );
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={[globalStyles.container, styles.container]}>
                <SafeAreaView style={globalStyles.safeArea}>
                    <Image source={Logo} style={styles.logoStyling}/>
                    <View style={globalStyles.header}>
                        <View style={{ width: 50, height: 50 }} />
                        {/* <Image source={{ uri: 'URL_TO_YOUR_LOGO' }} style={styles.logo} /> */}
                        <Text style={styles.signInText}>Login</Text>
                        <TouchableOpacity onPress={navToSignup}>
                            <Text style={styles.signupButtonText}>Signup</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <KeyboardAvoidingView behavior='padding'>
                    <TextInput placeholder="Email" placeholderTextColor='#C3C3C3' autoCapitalize="none" value={email} style={globalStyles.input} onChangeText={(text) => setEmail(text)}></TextInput>
                    <TextInput placeholder="Password" placeholderTextColor='#C3C3C3' secureTextEntry value={password} style={globalStyles.input} onChangeText={(text) => setPassword(text)}></TextInput>

                    {loading ? <ActivityIndicator size="large" color="#0000ff" /> : (
                        <>
                            <TouchableOpacity style={globalStyles.generalButton} onPress={signIn}>
                                <Text style={styles.loginButtonText}>Sign In</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    <View style={styles.forgotPasswordWrapper}>
                        <TouchableOpacity onPress={handleForgotPasswordClick}>
                            <Text style={styles.forgotPassword}>Forgot your password?</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default Login;

const styles = StyleSheet.create({
    passButton: {
        backgroundColor: "#88ac4c"
    },
    logoStyling: {
        width: logoSize,
        height: 150,
        resizeMode: 'contain', 
        paddingBottom: 50,
        alignSelf: 'center',
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
    container: {
        // paddingBottom: 10,
        paddingTop: 0,
    },
    forgotPassword: {
        // textAlign: 'right',
        textDecorationLine: 'underline',
        color: 'white',
    },
    forgotPasswordWrapper: {
        alignItems: 'flex-end',
        padding: 10,
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