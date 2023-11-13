import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Square from './Square';
import Piece from './Piece';

const initialBoardSetup = [
  // Define your initial board setup here
  // Example: [{ piece: 'Rook', color: 'black', position: { x: 0, y: 0 } }, ...]
  { piece: 'Rook', color: 'black', position: { x: 0, y: 0 } }
];

const Board = () => {
  const [pieces, setPieces] = useState(initialBoardSetup);

  const renderPiece = (piece, x, y) => {
    // Render the piece component or null if no piece is present
    console.log('begin rendering', piece)
    return piece ? <Piece type={piece.piece} color={piece.color} /> : null;
  };

  return (
    <View style={styles.board}>
      {Array.from({ length: 8 }, (_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {Array.from({ length: 8 }, (_, colIndex) => {
            const squareColor = (rowIndex + colIndex) % 2 === 0 ? 'white' : 'black';
            const piece = pieces.find(p => p.position.x === colIndex && p.position.y === rowIndex);
            return (
              <Square key={colIndex} color={squareColor}>
                {renderPiece(piece, colIndex, rowIndex)}
              </Square>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Board;
