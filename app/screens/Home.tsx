import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, FlatList, Alert, Platform } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import globalStyles from '../styles/globalStyles';
import profileImage from '../../assets/profile.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import deleteGameIcon from '../../assets/delete.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getGames, deleteGame, updateGame } from '../../src/mock/store';

const Home = () => {
		const fbAuth = FIREBASE_AUTH;

		const navigation = useNavigation();
		const navToProfile = () => {
			navigation.navigate('Profile');
		}
    const navToDebug = () => {
      navigation.navigate('Debug');
    }

    const [games, setGames] = useState([]);

    useFocusEffect(
      React.useCallback(() => {
        const fetchData = async () => {
          const userEmail = fbAuth.currentUser?.email ?? '';
          try {
            const pastGames = await getGames(userEmail);
            const sortedGames = [...pastGames].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setGames(sortedGames);
            const initialStarredStatus = {};
            sortedGames.forEach(game => {
              initialStarredStatus[game.gameID] = game.starred;
            });
            setStarredStatus(initialStarredStatus);
          } catch (error) {
            console.error('Error:', error);
          }
        };

        fetchData();
      }, [fbAuth, navigation])
    );

    const handleDeleteGame = async (gameId) => {
      const userEmail = fbAuth.currentUser?.email ?? '';
      try {
        await deleteGame(userEmail, gameId);
        const pastGames = await getGames(userEmail);
        const sortedGames = [...pastGames].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setGames(sortedGames);
        const initialStarredStatus = {};
        sortedGames.forEach(game => {
          initialStarredStatus[game.gameID] = game.starred;
        });
        setStarredStatus(initialStarredStatus);
      } catch (error) {
        console.error('Detailed error:', error);
      }
    };

    const handleDeleteGamePress = (gameId) => {
      if (Platform.OS === 'web') {
        if (window.confirm('Are you sure you want to delete this game?')) {
          handleDeleteGame(gameId);
        }
      } else {
        Alert.alert(
          'Delete Game',
          'Are you sure you want to delete this game?',
          [
            { text: 'Cancel', style: 'destructive' },
            { text: 'Delete', onPress: () => handleDeleteGame(gameId) },
          ],
        );
      }
    };

	const [starredStatus, setStarredStatus] = useState({});

	const handleStarClick = async (gameId) => {
		const newStarredStatus = !starredStatus[gameId];
		setStarredStatus({ ...starredStatus, [gameId]: newStarredStatus });
		try {
		  const userEmail = fbAuth.currentUser?.email ?? '';
		  await updateGame(userEmail, gameId, { starred: newStarredStatus });
		} catch (error) {
		  console.error('Error updating star:', error);
		  setStarredStatus({ ...starredStatus, [gameId]: !newStarredStatus });
		}
	  };

    const renderItem = ({ item }) => {
		return <TouchableOpacity testID={item.gameID.toString()}
			style={styles.opponentItem}
          	onPress={() => navigation.navigate('Game', { item: item })}
      		>
	  <Icon
        name={starredStatus[item.gameID] ? 'star' : 'star-o'}
        size={30}
        style={styles.faveIcon}
        onPress={() => handleStarClick(item.gameID)}
      />
         <Text style={styles.titleName} numberOfLines={1} ellipsizeMode='tail'>
          {item.title}
        </Text>
          {item.status === "Win" && (
              <View style={[styles.icon, styles.green]}>
                  <Text style={styles.statusText}>+</Text>
              </View>
          )}
          {item.status === "Loss" && (
              <View style={[styles.icon, styles.red]}>
                  <Text style={styles.statusText}>—</Text>
              </View>
          )}
          {item.status === "Draw" && (
              <View style={styles.icon}>
                  <Text style={styles.statusText}>=</Text>
              </View>
          )}
          {item.status === "Playing" && (
              <View style={[styles.icon, styles.yellow]}>
                  <Text style={styles.statusText}>≈</Text>
              </View>
          )}
          {item.status === "Unknown" && (
              <View style={styles.icon}>
                  <Text>?</Text>
              </View>
          )}
          <TouchableOpacity onPress={() => handleDeleteGamePress(item.gameID)}>
            <Icon name="trash" size={30} backgroundColor='transparent' color="#EF4035" style={styles.trashIcon} />
          </TouchableOpacity>
      </TouchableOpacity>
    };

    return (
        <View style={[globalStyles.container, styles.container]}>
          <SafeAreaView style={globalStyles.safeArea}>
          <View style={globalStyles.header}>
          <View style={styles.profileImagePlaceholder}></View>
            <Text style={styles.title}>Game Archive</Text>
            <TouchableOpacity onPress={navToProfile}>
                <Image source={profileImage} style={styles.profileImageStyle}></Image>
            </TouchableOpacity>
          </View>
          </SafeAreaView>
          <FlatList
            data={games}
            renderItem={renderItem}
            keyExtractor={item => item.gameID.toString()}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.noGamesText}>No Saved Games!</Text>
              </View>
            }
          />
      <SafeAreaView style={globalStyles.safeArea}>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[globalStyles.generalButton, styles.halfButton]} onPress={() => navigation.navigate('Camera' as never)}>
            <Text style={styles.playButtonText}>Upload Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.generalButton, styles.halfButton]} onPress={navToDebug}>
            <Text style={styles.playButtonText}>Enter FEN</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
		</View>

      );
};

export default Home;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noGamesText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusText: {
    color: 'black',
    fontWeight: 'bold',
  },
    container: {
      padding: 0,
    },
    title: {
      textAlign: 'center',
      flex: 1,
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
    },
    archiveList: {
      flex: 1,
      marginBottom: 20,
    },
    opponentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 5,
      paddingTop: 5,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: "#24231f",
    },
    titleName: {
      flex: 1,
      color: 'white',
      fontSize: 18,
    },
    icon: {
      width: 30,
      height: 30,
      backgroundColor: 'gray',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      marginLeft: 10,
    },
    trashIcon: {
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 10,
    },
    faveIcon: {
      color: '#f4d35e',
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    green: {
        backgroundColor: '#90b35a'
    },
    red: {
        backgroundColor: '#c44542'
    },
    yellow: {
        backgroundColor: '#f4d35e'
    },
    buttonRow: {
      flexDirection: 'row',
      gap: 10,
      margin: 20,
    },
    halfButton: {
      flex: 1,
      margin: 0,
    },
    playButtonText: {
      color: 'white',
      fontSize: 20,
      fontWeight: 'bold',
    },
    profileImageStyle: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    profileImagePlaceholder: {
      width: 24,
      height: 24,
      marginRight: 10,
      opacity: 0,
    },
  });
