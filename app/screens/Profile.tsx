import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, KeyboardAvoidingView } from 'react-native';
import globalStyles from '../styles/globalStyles';
import sampleProfileImage from '../../assets/sampleProfile.png'

const Profile = () => {
	
    //add logic here for pull image from db?
        //pfpImage = smth from db
    //tool button is for things like change password/username etc. buttons we can basically use to change profile features
    //not sure how the extent of how much we will use it tho
  return (
	<View style={[globalStyles.container, styles.container]}>
		<View style={[globalStyles.header, styles.header]}>
			<Text style={styles.profileText}>Profile</Text>
		</View>
		<View style={styles.row}>
			<Text style={styles.infoTitle}>Profile Picture</Text>
			<Image source={sampleProfileImage} style={styles.profileImage}/>
		</View>
		<View style={styles.row}>
			<Text style={styles.infoTitle}>Username</Text>
			<Text style={styles.infoDetails}>User's_Username</Text>
		</View> 
		<View style={styles.row}>
			<Text style={styles.infoTitle}>First Name</Text>
			<Text style={styles.infoDetails}>Fname</Text>
		</View> 
		<View style={styles.row}>
			<Text style={styles.infoTitle}>Last Name</Text>
			<Text style={styles.infoDetails}>Lname</Text>
		</View> 
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
        flex:1,
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',  
    },
	infoTitle: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#b7b6b4'
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
		marginRight: 25,
    },
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
    	alignItems: 'center', 
    	padding: 10,
	},
	toolButton: {
        marginTop: 10,
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5,
      },
	toolButtonText: {
        fontSize: 16,
      },
});


