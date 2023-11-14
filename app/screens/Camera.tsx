import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Permissions from 'expo-permissions';
import { Camera , CameraType } from 'expo-camera';
import globalStyles from '../styles/globalStyles';
import takeImage from '../../assets/takeImage.png';
import HomeIcon from '../../assets/homeIcon.png';
import acceptImage from '../../assets/acceptImage.png';
import rejectImage from '../../assets/rejectImage.png';
import retakeImage from '../../assets/retakeImage.png'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
// import Reanimated, {
//     useAnimatedProps,
//     useSharedValue,
//     withSpring,
//     addWhitelistedNativeProps
//   } from "react-native-reanimated"

const screenWidth = Dimensions.get('window').width;
const buttonSize = screenWidth * 0.2;

const CameraComponent = () => {

	const insets = useSafeAreaInsets();


    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [showCamera, setShowCamera] = useState(true);
    const [capturedImage, setCapturedImage] = useState(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        (async () => {
            const cameraPermission = await Camera.getCameraPermissionsAsync();
            if (cameraPermission.status === 'granted') {
                setHasCameraPermission(true);
            }
            else if (cameraPermission.status === 'undetermined') {
                const newCameraPermission = await Camera.requestCameraPermissionsAsync(); 
                if (newCameraPermission.status === 'granted') {
                    setHasCameraPermission(true);
                } else {
                    // Permission was denied or restricted.
                    // Handle this case as needed, e.g., show a message to the user.

                }
            } else {
                // Permission was denied or restricted.
                // Handle this case as needed, e.g., show a message to the user.

            }

        })();
    }, []);

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const options = { quality: 0.5, base64: true };
            const data = await (cameraRef.current as Camera).takePictureAsync(options);
            setCapturedImage(data.uri);
            setShowCamera(false);
        }
    }

    const handleAcceptPicture = async () => {
        if (!capturedImage) {
            console.error("No image captured");
            return;
        }
        navigation.navigate("Confirmation");
        // try {
        //     const imageResponse = await fetch(capturedImage.uri);
        //     const blob = await imageResponse.blob();
    
        //     let formData = new FormData();
        //     formData.append("image", blob, 'upload.jpg');
    
        //     let response = await fetch("https://your-server.com/upload", {
        //         method: "POST",
        //         body: formData,
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'multipart/form-data',
        //         },
        //     });
    
        //     let responseJson = await response.json();
        //     console.log(responseJson);
    
            // navigation.navigate("Game", { image: capturedImage });
            
    
        // } catch (error) {
        //     console.error("Error uploading image: ", error);
        // }
    
        setCapturedImage(null);
    };

    const handleRetakePicture = () => {
        setCapturedImage(null);
        setShowCamera(true);
    };

    const navigation = useNavigation();
    const handleCancelPicture = () => {
        navigation.navigate('Home')
        const swapScreen = navigation.addListener('transitionEnd', () => {
            setCapturedImage(null);
            setShowCamera(true);
            swapScreen();
        });
    };
    const imageView = (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: capturedImage }} style={{ flex: 1 }} resizeMode="contain" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', paddingBottom: 10 }}>
                    <TouchableOpacity onPress={handleCancelPicture}>
                        <Image source={rejectImage} style={styles.button} />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>Cancel</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', paddingBottom: 10 }}>
                    <TouchableOpacity onPress={handleRetakePicture}>
                        <Image source={retakeImage} style={styles.button} />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>Retake</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', paddingBottom: 10 }}>
                    <TouchableOpacity onPress={handleAcceptPicture}>
                        <Image source={acceptImage} style={styles.button} />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>Accept</Text>
                </View>
            </View>
        </View>
    );
    
    return (
        <View style={[globalStyles.container, styles.container]}>
            <SafeAreaView style={globalStyles.safeArea}>
            <View style={[globalStyles.header, styles.header, styles.headingContainer]}>
                <TouchableOpacity onPress={handleCancelPicture}>
					<Image source={HomeIcon} style={styles.iconStyle} />
				</TouchableOpacity>
                <Text style={styles.cameraText}>Camera</Text>
                <View style={styles.iconStylePlaceholder}></View>
            </View>
            </SafeAreaView>
            {showCamera ? (  
            <View style={{ flex: 1 }}>
			  <Camera style={{ flex: 1 , paddingBottom: insets.bottom > 0 ? insets.bottom : 10}} type={CameraType.back} ref={cameraRef}>
				<View style={{ flex: 1, backgroundColor: 'transparent', flexDirection: 'row' }}>
                    <TouchableOpacity style={{ flex: 1, alignSelf: 'flex-end', alignItems: 'center' }} onPress={handleTakePicture}>
                        <Image source={takeImage} style={styles.takeImageStyle}></Image>
				  </TouchableOpacity>
				</View>
			  </Camera>
			</View>
            ) : (
                imageView
            ) }
        </View>
    );
};




export default CameraComponent;

const styles = StyleSheet.create({
    container: {
		padding: 0,
	},
    headingContainer: {
        padding: 0,
        paddingBottom: 10,
    },
    header: {
		padding: 25,
		marginBottom: 0,
		alignItems: 'center'
	},
    cameraText: {
		textAlign: 'center',
		flex: 1,
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
	},
    takeImageStyle: {
        width: 100,
        height: 100,
    },
    button: {
        // width: 100,
        width: buttonSize,
        height: buttonSize,
        // height: 100,
        padding: 5,
        margin:5,
        alignItems: 'center',
        // margin: 20,
    },
    iconStyle: {
		width: 30,
		height: 30,
        marginLeft: 10,
	},
    iconStylePlaceholder: {
        width: 30,
        height: 30,
        opacity: 0,
        marginRight: 10,
    },
    buttonText: {
        paddingLeft: 5,
        // paddingRight: 5,
        paddingBottom: 10,
        alignItems: 'center',
        margin:5,
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
});