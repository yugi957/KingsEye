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
import * as FileSystem from 'expo-file-system';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import basePfp from '../../assets/base_pfp.png';

const Profile = () => {

	const [editMode, setEditMode] = useState(false);
	const [profileImage, setProfileImage] = React.useState(null);
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('Fname');
	const [lastName, setLastName] = useState('Lname');
	const [editIconSource, setEditIconSource] = useState(profileEditIcon);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [loading, setLoading] = useState(true);

	const fbAuth = FIREBASE_AUTH;

	const handleSignOut = async () => {
		await fbAuth.signOut();
		navigation.navigate('Login');
	};

	const handleSignOutClick = () => {
		showSignOutConfirmation();
	}

	const resizeImage = async (uri) => {
		try {
			const manipResult = await ImageManipulator.manipulateAsync(
				uri,
				[{ resize: { width: 200, height: 200 } }],
				{ compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
			);

			const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
				encoding: FileSystem.EncodingType.Base64,
			});

			return `data:image/jpeg;base64,${base64}`;
		} catch (err) {
			console.log(err);
			return null;
		}
	};

	const handleImageOptionsClick = async () => {
		const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (status !== 'granted') {
			alert('Sorry, we need camera roll permissions to edit profile picture!');
		}

		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [1, 1],
			quality: .5,
		});

		if (!result.canceled) {
			const resizedBase64Image = await resizeImage(result.uri);
			if (resizedBase64Image) {
				setProfileImage(resizedBase64Image);
			}
		}
	};


	useEffect(() => {
		const userEmail = fbAuth.currentUser.email;
		const url = `https://kingseye-1cd08c4764e5.herokuapp.com/getUser?email=${encodeURIComponent(userEmail)}`;

		fetch(url)
			.then(response => response.json())
			.then(data => {
				setProfileImage(data.profileImage);
				setFirstName(data.firstName);
				setLastName(data.lastName);
				setEmail(data.email);
				setLoading(false);
			})
			.catch(error => console.error('Error:', error));
	}, []);

	const handleEditClick = () => {
		setEditMode(!editMode);

		if (editMode) {
			fetch('https://kingseye-1cd08c4764e5.herokuapp.com/setUserData', {
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

	const navigation = useNavigation();
	const navToHome = () => {
		navigation.navigate('Home')
	}

	const handleChangePasswordClick = () => {
		setShowChangePassword(!showChangePassword);
		showPasswordResetConfirmation();
	};

	const sendPasswordReset = async () => {
		try {
			await sendPasswordResetEmail(FIREBASE_AUTH, email);
			Alert.alert("Password Reset", "Password reset email sent successfully.");
		} catch (error) {
			console.error("Password Reset Error", error);
			Alert.alert("Password Reset Failed", "Failed to send password reset email.");
		}
	};

	const showPasswordResetConfirmation = () => {
		Alert.alert(
			'Password Reset Confirmation',
			'Are you sure you want to reset your password? An email will be sent to your email address.',
			[
				{
					text: 'No',
					style: 'destructive',
				},
				{
					text: 'Yes',
					style: 'default',
					onPress: sendPasswordReset,
				},
			],
			{ cancelable: false }
		);
	};

	const showSignOutConfirmation = () => {
		Alert.alert(
			'Sign Out Confirmation',
			'Are you sure you want to sign out? You will be taken back to the login page.',
			[
				{
					text: 'No',
					style: 'default',
				},
				{
					text: 'Yes',
					style: 'destructive',
					onPress: () => {
						handleSignOut();
					},
				},
			],
			{ cancelable: false }
		);
	};

	return (
		<View style={[globalStyles.container, styles.container]}>
			<SafeAreaView style={globalStyles.safeArea}>
				<View style={globalStyles.header}>
					<TouchableOpacity onPress={navToHome}>
						<Image source={HomeIcon} style={styles.IconStyle} />
					</TouchableOpacity>
					<Text style={styles.profileText}>Profile</Text>
					<View style={styles.IconStyleTransparent}></View>
					<TouchableOpacity onPress={handleEditClick}>
						<Image source={editIconSource} style={styles.EditIconStyle} />
					</TouchableOpacity>
				</View>
			</SafeAreaView>
			<View style={styles.row}>
				<Text style={styles.infoTitle}>Profile Picture</Text>
				{!loading && (
					<Image
						source={profileImage && profileImage !== 'none' ? { uri: profileImage } : basePfp}
						style={styles.profileImage}
					/>
				)}
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
						<Text style={styles.buttonText}>Edit Profile Picture</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={handleChangePasswordClick} style={[globalStyles.generalButton, styles.buttonContainer]}>
						<Text style={styles.buttonText}>Reset Password</Text>
					</TouchableOpacity>
				</View>
			)}
			<View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
				<SafeAreaView style={globalStyles.safeArea}>
					<TouchableOpacity onPress={handleSignOutClick} style={styles.signOutButton}>
						<Text style={styles.signOutButtonText}>Sign Out</Text>
					</TouchableOpacity>
				</SafeAreaView>
			</View>
		</View>
	);
};

export default Profile;

const styles = StyleSheet.create({
	container: {
		padding: 0,
		// paddingBottom: 20,
		// paddingTop: 30,
	},
	// header: {
	// 	padding: 25,
	// 	marginBottom: 0,
	// 	alignItems: 'center'
	// },
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
		height: 24,
		marginRight: 10,
	},
	IconStyle: {
		width: 30,
		height: 30,
		marginLeft: 10,
	},
	IconStyleTransparent: {
		width: 6,
		height: 6,
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
		backgroundColor: '#ef3e36',
		padding: 10,
		borderRadius: 5,
		alignSelf: 'center',
	},
	signOutButtonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
		textAlign: 'center',
	}
});

