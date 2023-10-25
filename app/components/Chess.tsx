import React from "react";
import { View, StyleSheet } from "react-native";
import globalStyles from '../styles/globalStyles';
import Board from "./Board";

const styles = StyleSheet.create({
  container: {
    padding: 0,
    paddingBottom: 20,
    paddingTop: 30,
  },
  board: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgb(36, 35, 32)",
  },
});

const ChessBoard = () => {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <View style={styles.board}>
        <Board />
      </View>
    </View>
  );
};

export default ChessBoard;
