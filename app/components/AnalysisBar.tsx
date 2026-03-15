import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { getEvaluationScore, getPrincipalVariation } from '../../src/mock/stockfish';

const AnalysisBar = ({ fen }) => {
  const [evScore, setEvScore] = useState(null);
  const [principalVariation, setPrincipalVariation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!fen) return;

    let cancelled = false;
    setEvScore('Loading');
    setPrincipalVariation([]);
    setIsLoading(true);

    (async () => {
      try {
        const [score, pv] = await Promise.all([
          getEvaluationScore(fen),
          getPrincipalVariation(fen),
        ]);
        if (!cancelled) {
          setEvScore(score);
          setPrincipalVariation(pv);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) setEvScore('Error');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [fen]);

  const isWhiteWinning = evScore && evScore > 0 || typeof evScore === 'string' && !evScore.includes('-');
  const isBlackWinning = evScore && evScore < 0 || typeof evScore === 'string' && evScore.includes('-');
  const isMate = typeof evScore === 'string' && evScore.toLowerCase().includes('mate');

  const scoreBackgroundColor = isWhiteWinning ? 'white' : (isBlackWinning || isMate) ? 'black' : 'grey';
  const scoreTextColor = isWhiteWinning ? 'black' : 'white';

  return (
    <View style={styles.container}>
      <View style={[styles.score, { backgroundColor: scoreBackgroundColor }]}>
        <Text style={[styles.scoreText, { color: scoreTextColor }]}>{evScore}</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movesList}>
        {Array.isArray(principalVariation) && principalVariation.map((move, index) => (
          <View key={index} style={styles.moveItem}>
            <Text style={styles.moveText}>{`${index + 1}. ${move}`}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  score: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 10,
  },
  scoreText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  movesList: {
    flexGrow: 1,
  },
  moveItem: {
    marginRight: 15,
  },
  moveText: {
    fontSize: 15,
    color: 'white',
  },
});

export default AnalysisBar;
