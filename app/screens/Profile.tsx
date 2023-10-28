import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import globalStyles from '../styles/globalStyles';
import sampleProfileImage from '../../assets/sampleProfile.png';
import profileEditIcon from '../../assets/profileEdit.png';
import profileSaveIcon from '../../assets/editDoneIcon.png';
import HomeIcon from '../../assets/homeIcon.png';
import { getAuth, sendPasswordResetEmail, signOut } from "firebase/auth";
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { launchImageLibrary } from 'react-native-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'react-native-image-picker';

const Profile = () => {

	//add logic here for pull image from db?
	//pfpImage = smth from db
	//tool button is for things like change password/username etc. buttons we can basically use to change profile features
	//not sure how the extent of how much we will use it tho

	const [editMode, setEditMode] = useState(false);
	const [profileImage, setProfileImage] = React.useState(null);
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('Fname');
	const [lastName, setLastName] = useState('Lname');
	const [editIconSource, setEditIconSource] = useState(profileEditIcon);
	const [showImageOptions, setShowImageOptions] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [loading, setLoading] = useState(true);

	const fbAuth = FIREBASE_AUTH;

	const handleSubmit = (e) => {
		e.preventDefault();
	}

	const handleFileUpload = async (e) => {
		const file = e.target.files;
		console.log(file);
	}

	const handleSignOut = async () => {
		try {
			await fbAuth.signOut();
			navigation.navigate('Login');
			// Handle successful sign out here
		} catch (error) {
			// Handle error here
		}
	};

	// function convertToBase64(file) {
	// 	return new Promise((resolve, reject) => {
	// 		const fileReader = new FileReader();
	// 		fileReader.readAsDataURL(file);
	// 		fileReader.onload = () => {
	// 			resolve(fileReader.result);
	// 		};
	// 		fileReader.onerror = (error) => {
	// 			reject(error);
	// 		}
	// 	})
	// }

	const convertImageToBase64 = async (uri) => {
		const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
		return base64;
	};

	const handleImageOptionsClick = () => {
		ImagePicker.launchImageLibrary({
			mediaType: 'photo',
			includeBase64: false,
			maxHeight: 200,
			maxWidth: 200,
		}, response => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
				const source = { uri: response.assets[0].uri };
				console.log(convertImageToBase64(source))
				setProfileImage(source);
			}
		});
		setShowImageOptions(!showImageOptions);
	};

	useEffect(() => {
		const userEmail = fbAuth.currentUser.email;
		fetch('https://kingseye-1cd08c4764e5.herokuapp.com/getUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email: userEmail }),
		})
			.then(response => response.json())
			.then(data => {
				console.log(data)
				setProfileImage(data.profileImage);
				setFirstName(data.firstName);
				setLastName(data.lastName);
				setEmail(data.email);
				setLoading(false); // Set loading to false after data has been fetched
			})
			.catch(error => console.error('Error:', error));
	}, []);


	const handleEditClick = () => {
		setEditMode(!editMode);

		if (editMode) {
			fetch('http://kingseye-1cd08c4764e5.herokuapp.com/setUserData', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: fbAuth.currentUser.email, fname: firstName, lname: lastName, photo: profileImage }),
			})
				.then(response => response.json())
				.then(data => {
					console.log('user updated');
				})
				.catch(error => console.error('Error:', error));
			setEditIconSource(profileEditIcon);
		} else {
			setEditIconSource(profileSaveIcon);
		}
	};

	const handleChangePasswordClick = () => {
		setShowChangePassword(!showChangePassword);
		showPasswordResetConfirmation();
	};

	const navigation = useNavigation();
	const navToHome = () => {
		navigation.navigate('Home')
	}

	const showPasswordResetConfirmation = () => {
		Alert.alert(
			'Password Reset Confirmation',
			'Are you sure you want to reset your password? An email will be sent to your {email}.',
			[
				{
					text: 'No',
					style: 'destructive',
				},
				{
					text: 'Yes',
					style: 'default',
					onPress: () => {
						//handle the password reset logic here @qazx
						//sendPasswordResetEmail();
					},
				},
			],
			{ cancelable: false }
		);
	};

	if (loading) {
		return <Text>Loading...</Text>; // Replace with a loading spinner or other loading indicator
	}

	return (
		<View style={[globalStyles.container, styles.container]}>
			<View style={[globalStyles.header, styles.header]}>
				<TouchableOpacity onPress={navToHome}>
					<Image source={HomeIcon} style={styles.IconStyle} />
				</TouchableOpacity>
				<Text style={styles.profileText}>Profile</Text>
				<TouchableOpacity onPress={handleEditClick}>
					{/* <Image source={profileEditIcon} style={styles.editIconStyle}></Image> */}
					<Image source={editIconSource} style={styles.EditIconStyle} />
				</TouchableOpacity>
			</View>
			<View style={styles.row}>
				<Text style={styles.infoTitle}>Profile Picture</Text>
				<Image source={profileImage || sampleProfileImage} style={styles.profileImage} />
			</View>
			<View style={styles.row}>
				<Text style={styles.infoTitle}>Email</Text>
				<Text style={styles.infoDetails}>{email}</Text>
			</View>
			<View style={styles.row}>
				<Text style={styles.infoTitle}>First Name</Text>
				{editMode ? (
					<TextInput
						style={styles.infoInput}
						value={firstName}
						onChangeText={(text) => setFirstName(text)}
					/>
				) : (
					<Text style={styles.infoDetails}>{firstName}</Text>
				)}

			</View>
			<View style={styles.row}>
				<Text style={styles.infoTitle}>Last Name</Text>
				{editMode ? (
					<TextInput
						style={styles.infoInput}
						value={lastName}
						onChangeText={(text) => setLastName(text)}
					/>
				) : (
					<Text style={styles.infoDetails}>{lastName}</Text>
				)}
			</View>
			{editMode && (
				<View>
					<TouchableOpacity onPress={handleImageOptionsClick} style={[globalStyles.generalButton, styles.buttonContainer]}>
						<Text style={styles.buttonText}>Edit Picture</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleChangePasswordClick} style={[globalStyles.generalButton, styles.buttonContainer]}>
						<Text style={styles.buttonText}>Reset Password</Text>
					</TouchableOpacity>
				</View>
			)}
			<TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
				<Text style={styles.signOutButtonText}>Sign Out</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Profile;

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
	profileText: {
		textAlign: 'center',
		flex: 1,
		color: 'white',
		fontSize: 30,
		fontWeight: 'bold',
	},
	infoTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#b7b6b4'
	},
	infoInput: {
		flex: 0.5,
		fontSize: 16,
		paddingHorizontal: 10,
		borderWidth: 1,
		borderColor: 'gray',
		borderRadius: 5,
		color: '#b7b6b4',
		fontWeight: '500',
	},
	infoDetails: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#b7b6b4',
		alignSelf: 'flex-end'
	},
	profileImage: {
		width: 100,
		height: 100,
	},
	EditIconStyle: {
		width: 24,
		height: 24
	},
	IconStyle: {
		width: 30,
		height: 30,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 20,
		borderBottomColor: '#22211f',
		borderBottomWidth: 1,
	},
	buttonContainer: {
		backgroundColor: '#3D3D3D',
	},
	buttonText: {
		color: '#9B9B9B',
		textAlign: 'center',
		fontWeight: '500',
	},
	signOutButton: {
		width: 100,
		backgroundColor: 'red',
		padding: 10,
		borderRadius: 5,
		alignItems: 'center',
		position: 'absolute',
		top: 570,
		right: 150//fix
	},
	signOutButtonText: {
		color: '#fff',
		fontSize: 16,
	}
});

