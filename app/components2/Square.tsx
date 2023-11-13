import React from 'react';
import { View, StyleSheet } from 'react-native';

const Square = ({ color, children }) => {
  return (
    <View style={[styles.square, { backgroundColor: color }]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    width: 40, // or any size you want
    height: 40, // or any size you want
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible'
  },
});

export default Square;
