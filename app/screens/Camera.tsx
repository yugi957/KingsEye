import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ActivityIndicator, Modal } from 'react-native';
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
import * as ImageManipulator from 'expo-image-manipulator';
import { Dimensions } from 'react-native';
import HomeButton from '../components/HomeButton';
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

    const [showCustomAlert, setShowCustomAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [debugImage, setDebugImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true); // Start loading

        const preblob = await fetchAndConvertToBlob(capturedImage);
        const pre = await readBlobAsBase64(preblob);

        console.log("pre length: ", pre.length)
    
        // Resize the image and wait for the operation to complete
        const resizedImageUri = await resizeImage(capturedImage);
        setCapturedImage(resizedImageUri);
    
        // Fetch the resized image and convert to blob
        const blob = await fetchAndConvertToBlob(resizedImageUri);
    
        // Read the blob as base64 and send it
        const base64data = await readBlobAsBase64(blob);
        console.log('post length: ', base64data.length);
        const image64 = base64data.split(",")[1];
        const response = await sendBase64Image(image64);

        console.log('NN response: ', response.status)

        if (response.status === 200) {
            // Navigate to the next screen
            navigation.navigate("Confirmation", { fen: response.body + " w KQkq - 0 1" });
            // Reset the capturedImage state
            setCapturedImage(null);
            console.log("Success: ", response.body);
            // Example: navigation.navigate("SuccessScreen", { data: response.body });
        } else if (response.status === 400) {
            // Handle client error (Bad Request)
            setAlertMessage(response.body.error); // Set your error message
            setDebugImage('data:image/[jpeg];base64,' + response.body.image); // Set the debug image URL
            setShowCustomAlert(true);
            console.error("Bad Request: ", response.body.error);
            // Example: Show an error message to the user
        } else if (response.status === 500) {
            // Handle server error
            console.error("Server Error: ", response.error);
            // Example: Show a server error message to the user
        }
    };

    const resizeImage = async (uri) => {
        checkImageSize(uri)
        const manipResult = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 640, height: 640 } }],
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
        );
        checkImageSize(manipResult)
        return manipResult.uri;
    };
    
    const fetchAndConvertToBlob = async (uri) => {
        const imageResponse = await fetch(uri);
        return await imageResponse.blob();
    };

    const readBlobAsBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob); 
        });
    };

    const sendBase64Image = async (base64Image) => {
        const url = "https://rbz0ltdjwg.execute-api.us-east-2.amazonaws.com/Development/process-image";
        const headers = {
            'Accept': '*/*',
            'Content-Type': 'text/plain',
        };
        try {
            const response = await fetch(url, {
                method: "POST",
                body: base64Image,
                headers: headers,
            });
            const responseJson = await response.json();
            // console.log(responseJson);
            setIsLoading(false); // Stop loading
            return { status: response.status, body: responseJson };
        } catch (error) {
            console.error("Error uploading image: ", error);
            setIsLoading(false); // Stop loading in case of error
            return { status: 500, body: null, error };
        }
    };

    const checkImageSize = (uri) => {
        Image.getSize(uri, (width, height) => {
            console.log(`The image dimensions are ${width}x${height}`);
        }, (error) => {
            console.error(`Couldn't get the image size: ${error.message}`);
        });
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
            <View style={styles.buttonHorizontal}>
                <View style={styles.buttonVertical}>
                    <TouchableOpacity onPress={handleCancelPicture}>
                        <Image source={rejectImage} style={styles.button} />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>Cancel</Text>
                </View>
                <View style={styles.buttonVertical}>
                    <TouchableOpacity onPress={handleRetakePicture}>
                        <Image source={retakeImage} style={styles.button} />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>Retake</Text>
                </View>
                <View style={styles.buttonVertical}>
                    <TouchableOpacity onPress={handleAcceptPicture}>
                        <Image source={acceptImage} style={styles.button} />
                    </TouchableOpacity>
                    <Text style={styles.buttonText}>Accept</Text>
                </View>
            </View>
        </View>
    );

    const CustomAlert = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showCustomAlert}
            onRequestClose={() => {
                setShowCustomAlert(!showCustomAlert);
            }}>
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{alertMessage}</Text>
                    <Image source={{ uri: debugImage }} style={styles.debugImage} />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setShowCustomAlert(false)}>
                        <Text style={[styles.buttonText, {color: 'black'}]}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
    
    return (
        
        <View style={[globalStyles.container, styles.container]}>
            <SafeAreaView style={globalStyles.safeArea}>
            <View style={[globalStyles.header, styles.header, styles.headingContainer]}>
            <HomeButton navigation={navigation} onCustomPress={undefined} />
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
            {isLoading && (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
            )}
            <CustomAlert />
        </View>
    );
};




export default CameraComponent;

const styles = StyleSheet.create({
    buttonHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    buttonVertical: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 10,
    },
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
    loadingContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
        zIndex: 2, //On top of other elements
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
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
        textAlign: "center"
    },
    debugImage: {
        width: 200, // Adjust as needed
        height: 200, // Adjust as needed
        marginBottom: 15,
    },
    // button: {
    //     // Button styling
    // },
    // buttonText: {
    //     // Button text styling
    // },
});