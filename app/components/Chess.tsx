import React from "react";
import { View, StyleSheet } from "react-native";

import Board from "./Board";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(36, 35, 32)",
  },
});

const ChessBoard = () => {
  return (
    <View style={styles.container}>
      <Board />
    </View>
  );
};

export default ChessBoard;
