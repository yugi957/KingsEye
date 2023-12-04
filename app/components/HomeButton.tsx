import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import HomeIcon from '../../assets/homeIcon.png';

const HomeButton = ({ navigation, onCustomPress }) => {
    const navToHome = () => {
      if (onCustomPress) {
        onCustomPress();
      } else {
        navigation.navigate('Home');
      }
    };

  return (
    <TouchableOpacity onPress={navToHome} style={styles.container}>
      <Image source={HomeIcon} style={styles.iconStyle} />
    </TouchableOpacity>
  );
};

export default HomeButton;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    // paddingBottom: 20,
    // paddingTop: 30,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginLeft: 10,
  },
});
