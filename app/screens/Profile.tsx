import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import globalStyles from '../styles/globalStyles';
import sampleProfileImage from '../../assets/sampleProfile.png';
import profileEditIcon from '../../assets/profileEdit.png';
import profileSaveIcon from '../../assets/editDoneIcon.png';
import { getAuth } from "firebase/auth";
import { FIREBASE_AUTH } from '../../FirebaseConfig';

const Profile = () => {

	//add logic here for pull image from db?
	//pfpImage = smth from db
	//tool button is for things like change password/username etc. buttons we can basically use to change profile features
	//not sure how the extent of how much we will use it tho

	const [editMode, setEditMode] = useState(false);
	const [email, setEmail] = useState('');
	const [firstName, setFirstName] = useState('Fname');
	const [lastName, setLastName] = useState('Lname');
	const [editIconSource, setEditIconSource] = useState(profileEditIcon);
	const [showImageOptions, setShowImageOptions] = useState(false);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const fbAuth = FIREBASE_AUTH;

	useEffect(() => {
		const userEmail = fbAuth.currentUser.email;
	  
		fetch('http://localhost:3000/getUser', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ email: userEmail }),
		})
		  .then(response => response.json())
		  .then(data => {
			setFirstName(data.firstName);
			setLastName(data.lastName);
			setEmail(data.email);
		  })
		  .catch(error => console.error('Error:', error));
	  }, []);


	const handleEditClick = () => {
		setEditMode(!editMode);

		if (editMode) {
			console.log('saved');
			//call endpoint here to save changes to db
			setEditIconSource(profileEditIcon);
		} else {
			setEditIconSource(profileSaveIcon);
		}
	};

	const handleImageOptionsClick = () => {
		setShowImageOptions(!showImageOptions);
	};

	const handleChangePasswordClick = () => {
		setShowChangePassword(!showChangePassword);
		showPasswordResetConfirmation();
	};

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


	return (
		<View style={[globalStyles.container, styles.container]}>
			<View style={[globalStyles.header, styles.header]}>
				<Text style={styles.profileText}>Profile</Text>
				<TouchableOpacity onPress={handleEditClick}>
					{/* <Image source={profileEditIcon} style={styles.editIconStyle}></Image> */}
					<Image source={editIconSource} style={styles.editIconStyle} />
				</TouchableOpacity>
			</View>
			<View style={styles.row}>
				<Text style={styles.infoTitle}>Profile Picture</Text>
				<Image source={sampleProfileImage} style={styles.profileImage} />
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
	editIconStyle: {
		width: 24,
		height: 24
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
});


