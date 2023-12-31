import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AnalysisBar = ({ fen }) => {
  const [evScore, setEvScore] = useState(null);
  const [principalVariation, setPrincipalVariation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let computed_fen = '';
  let recent_fen = '';

  const fetchAnalysis = async () => {
    if (isLoading) {
      return;
    }

    computed_fen = fen;
    setIsLoading(true);

    try {
      console.log("FETCHING ANALYSIS")
      const scoreResponse = await fetch(`https://kingseye-1cd08c4764e5.herokuapp.com/evaluationScore?fen=${fen}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const pvResponse = await fetch(`https://kingseye-1cd08c4764e5.herokuapp.com/principalVariation?fen=${fen}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!scoreResponse.ok) throw new Error('Error fetching evaluation score');
      if (!pvResponse.ok) throw new Error('Error fetching principal variation');

      const scoreData = await scoreResponse.json();
      const pvData = await pvResponse.json();

      setEvScore(scoreData.evaluation);
      setPrincipalVariation(pvData.moves);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fen) {
      setEvScore("Loading");
      recent_fen = fen;
      fetchAnalysis();
    }
  }, [fen]);

  useEffect(() => {
    if (isLoading == false) {
      if (recent_fen != computed_fen) {
        fetchAnalysis();
        console.log('spam')
      }
    }
  }, [isLoading]);

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