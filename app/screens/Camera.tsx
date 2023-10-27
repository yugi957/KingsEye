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
// import Reanimated, {
//     useAnimatedProps,
//     useSharedValue,
//     withSpring,
//     addWhitelistedNativeProps
//   } from "react-native-reanimated"



const CameraComponent = () => {

    const navigation = useNavigation();
	const navToHome = () => {
        navigation.navigate('Home')
    }


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

    const handleAcceptPicture = () => {
        // @qazx: do something with the captured image
        // @adi9103: nav to the game screen and pass the image as a prop
        setCapturedImage(null);
    };

    const handleRetakePicture = () => {
        setCapturedImage(null);
        setShowCamera(true);
    };

    const handleCancelPicture = () => {
        setCapturedImage(null);
        setShowCamera(false);
    };
    const imageView = (
        <View style={{ flex: 1 }}>
            <Image source={{ uri: capturedImage }} style={{ flex: 1 }} resizeMode="contain" />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                <View style={{ flexDirection: 'column', alignItems: 'center', paddingBottom: 10 }}>
                    <TouchableOpacity onPress={navToHome}>
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
            <View style={[globalStyles.header, styles.header]}>
            <TouchableOpacity onPress={navToHome}>
					<Image source={HomeIcon} style={styles.IconStyle} />
				</TouchableOpacity>
                <Text style={styles.cameraText}>Camera</Text>
            </View>
            {showCamera ? (
            <View style={{ flex: 1 }}>
			  <Camera style={{ flex: 1 }} type={CameraType.back} ref={cameraRef} enableZoomGesture={true}>
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
		paddingBottom: 20,
		paddingTop: 30,
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
        width: 100,
        height: 100,
        padding: 5,
        margin:5,
        alignItems: 'center',
        // margin: 20,
    },
    IconStyle: {
		width: 30,
		height: 30,
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