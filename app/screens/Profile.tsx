import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';

const Profile = () => {

    //add logic here for pull image from db?
        //pfpImage = smth from db
    //tool button is for things like change password/username etc. buttons we can basically use to change profile features
    //not sure how the extent of how much we will use it tho
  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={styles.profileText}>Profile</Text>
      </View>
      <View style={styles.profileContent}>
        {/* <Image source={{ pfpImage }} style={styles.profileImage} /> */}
        <View style={styles.profileInfo}>
           <Text style={styles.userName}>Username</Text>
          {/* tool button example: */}
          {/* <TouchableOpacity style={styles.toolButton}> */}
            <Text style={styles.toolButtonText}>Change Password</Text>
          {/* </TouchableOpacity> */}
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
    profileText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
      },
      profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
      },
      profileImage: {
        width: 100, //can adjust
        height: 100, //can adjust
      },
      profileInfo: {
        marginLeft: 20,
      },
      userName: {
        fontSize: 20,
        fontWeight: 'bold',
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


