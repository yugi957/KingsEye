import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';

const Piece = ({ type, color }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('granted');
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: () => {
        console.log('released');
        pan.flattenOffset();
      },
    })
  ).current;

  useEffect(() => {
    console.log(`Piece typeeee: ${type}`);
  }, [type]);

  return (
    <Animated.View
      style={[pan.getLayout(), styles.pieceContainer]}
      {...panResponder.panHandlers}
    >
      <Text style={{ color }}>{type}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pieceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default Piece;
