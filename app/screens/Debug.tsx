/**
 * Debug.tsx — DEMO BRANCH
 *
 * Replaces the camera/AWS debug screen with a simple FEN-paste interface.
 * Users can enter a FEN string to open a game for analysis.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chess } from 'chess.js';
import globalStyles from '../styles/globalStyles';
import { saveGame } from '../../src/mock/store';

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const SAMPLE_FENS = [
  { label: 'Starting Position', fen: STARTING_FEN },
  { label: 'Sicilian (after 1.e4 c5 2.Nf3)', fen: 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2' },
  { label: 'Ruy Lopez (after 3.Bb5)', fen: 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3' },
  { label: 'Endgame (K+Q vs K)', fen: '4k3/8/8/8/8/8/8/4KQ2 w - - 0 1' },
];

const DebugComponent = () => {
  const navigation = useNavigation();
  const [fen, setFen] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const validateAndOpen = async (fenToUse: string, gameTitle: string) => {
    const trimmed = fenToUse.trim() || STARTING_FEN;
    try {
      new Chess(trimmed); // throws if invalid
    } catch {
      setError('Invalid FEN string. Please check and try again.');
      return;
    }

    const newGame = await saveGame({
      title: gameTitle.trim() || 'New Game',
      status: 'Playing',
      side: 'White',
      opponentName: 'Opponent',
      moves: [trimmed],
    });

    navigation.navigate('Game', { item: newGame });
  };

  return (
    <View style={[globalStyles.container, styles.container]}>
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={globalStyles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>New Game</Text>
          <View style={styles.placeholder} />
        </View>
      </SafeAreaView>

      <View style={styles.content}>
        <Text style={styles.label}>Game Title (optional)</Text>
        <TextInput
          style={globalStyles.input}
          placeholder="e.g. Sicilian Defense"
          placeholderTextColor="#C3C3C3"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Paste FEN (leave blank for starting position)</Text>
        <TextInput
          style={[globalStyles.input, styles.fenInput]}
          placeholder={STARTING_FEN}
          placeholderTextColor="#C3C3C3"
          value={fen}
          onChangeText={(t) => { setFen(t); setError(''); }}
          autoCapitalize="none"
          autoCorrect={false}
          multiline
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={globalStyles.generalButton}
          onPress={() => validateAndOpen(fen, title)}
        >
          <Text style={styles.buttonText}>Open Position</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>— or pick a sample position —</Text>
        {SAMPLE_FENS.map((s) => (
          <TouchableOpacity
            key={s.fen}
            style={styles.sampleButton}
            onPress={() => validateAndOpen(s.fen, s.label)}
          >
            <Text style={styles.sampleLabel}>{s.label}</Text>
            <Text style={styles.sampleFen} numberOfLines={1}>{s.fen}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default DebugComponent;

const styles = StyleSheet.create({
  container: { padding: 0 },
  content: { padding: 20, flex: 1 },
  title: {
    flex: 1,
    textAlign: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  backText: { color: 'white', fontSize: 16, marginLeft: 10 },
  placeholder: { width: 60 },
  label: { color: '#b7b6b4', fontSize: 13, marginBottom: 6, marginTop: 16 },
  fenInput: { height: 70, textAlignVertical: 'top' },
  error: { color: '#EF4035', fontSize: 12, marginBottom: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  sectionLabel: {
    color: '#b7b6b4',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 20,
  },
  sampleButton: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  sampleLabel: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  sampleFen: { color: '#888', fontSize: 10, marginTop: 2 },
});
