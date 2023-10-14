import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import globalStyles from '../styles/globalStyles';

const Profile = () => {

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.header}>
        <Text style={styles.profileText}>Profile</Text>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
    profileText: {
        textAlign: 'center',
        flex:1,
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',  
    },
});


