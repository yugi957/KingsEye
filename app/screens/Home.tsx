import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, TextInput, Image, FlatList, Alert } from 'react-native';
import { useNavigation} from '@react-navigation/native';
import React, { useState, useEffect, useRef } from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import globalStyles from '../styles/globalStyles';
import profileImage from '../../assets/profile.png';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import deleteGameIcon from '../../assets/delete.png';
import Icon from 'react-native-vector-icons/FontAwesome';

const Home = () => {
		const fbAuth = FIREBASE_AUTH;
		
		const insets = useSafeAreaInsets();

		const navigation = useNavigation();
		const navToProfile = () => {
			navigation.navigate('Profile');
		}
		
    const navToCamera = () => {
      navigation.navigate('Camera');
    }
    const navToDebug = () => {
      navigation.navigate('Debug');
    }

    const [games, setGames] = useState([]);

    useFocusEffect(
      React.useCallback(() => {
        const fetchData = async () => {
          console.log('FETCHING DATA');
          const userEmail = fbAuth.currentUser?.email;
          const url = `https://kingseye-1cd08c4764e5.herokuapp.com/getGames?email=${(userEmail)}`;
          console.log(url)
      
          try {
            const response = await fetch(url);
            console.log('RESPONSE', response);
      
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
      
            const data = await response.json();
            console.log('DATA', data.pastGames);
            // setGames(data.pastGames);
			const sortedGames = [...data.pastGames].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
    
    const deleteGame = async ( gameId ) => {
      const userEmail = fbAuth.currentUser?.email;
      console.log("Deleting game with ID:", gameId);
      console.log("Deleting game with email:", userEmail);
      
      try {
        const response = await fetch(`https://kingseye-1cd08c4764e5.herokuapp.com/deleteGame`, {
        
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: userEmail,
            gameID: gameId,
          }),
        });
        const data = await response.json();

        if (response.ok) {
			const url = `https://kingseye-1cd08c4764e5.herokuapp.com/getGames?email=${userEmail}`;
			const responseReload = await fetch(url);
			const pastGames = await responseReload.json();
			console.log(data.message);
			const sortedGames = pastGames.pastGames.sort((a, b) => new Date(b.date) - new Date(a.date));
			setGames(sortedGames);
			  const initialStarredStatus = {}; 
    	sortedGames.forEach(game => {
      	initialStarredStatus[game.gameID] = game.starred;
    	});
    	setStarredStatus(initialStarredStatus);
        } else { 
          console.error(data.message); 
          console.error(`Error ${response.status}: ${response.statusText}`);
          const errorText = await response.text();
          console.error(errorText);
        }
      } catch (error) {
        console.error('Detailed error:', error.message.stack);
      }      
    };
    const handleDeleteGamePress = (gameId) => {
      Alert.alert(
        'Delete Game',
        'Are you sure you want to delete this game?',
        [
          { text: 'Cancel', style: 'destructive' },
          { text: 'Delete', onPress: () => deleteGame(gameId) },
        ],
      );
    };
    


    useEffect(() => {
      console.log('GAMES', games)
    }, [games]);

	const [starredStatus, setStarredStatus] = useState({});


	const handleStarClick = async (gameId) => {
		const newStarredStatus = !starredStatus[gameId];
		setStarredStatus({ ...starredStatus, [gameId]: newStarredStatus });
	  
		try {
		  const userEmail = fbAuth.currentUser?.email;
		  const response = await fetch(`https://kingseye-1cd08c4764e5.herokuapp.com/updateGame`, {
			method: 'PATCH',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  email: userEmail,
			  gameID: gameId,
			  starred: newStarredStatus,
			}),
		  });
	  
		  if (response.ok) {
			console.log('Server response:', await response.json());
			console.log(`Star status of game ${gameId} is now ${newStarredStatus}`)
		  }
		  else {
			const errorResponse = await response.json();
			console.error('Server response:', errorResponse);
			throw new Error('Failed to update the game');
		  }
		} catch (error) {
		  console.error('Error updating star:', error);
		  setStarredStatus({ ...starredStatus, [gameId]: !newStarredStatus });
		}
	  };
	  
	  
	

    const renderItem = ({ item }) => {
		return <TouchableOpacity
			style={styles.opponentItem}
          	onPress={() => navigation.navigate('Game', { item: item })}
      		>
				{/* <Icon
        name={starredStatus[item.gameID] ? 'star' : 'star-o'}
        size={30}
        style={styles.faveIcon}
        onPress={() => handleStarClick(item.gameID)}
      /> */}
	  <Icon
        name={starredStatus[item.gameID] ? 'star' : 'star-o'}
        size={30}
        style={styles.faveIcon}
        onPress={() => handleStarClick(item.gameID)}
      />
          <Text style={styles.titleName}>{item.title}</Text>

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
                  {/* <Text style={styles.statusText}>IP</Text> */}
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
          {/* Logo and Search */}
          <SafeAreaView style={globalStyles.safeArea}>
          <View style={globalStyles.header}>
          <View style={styles.profileImagePlaceholder}></View>
            <Text style={styles.title}>Game Archive</Text>
            <TouchableOpacity onPress={navToProfile}>
                <Image source={profileImage} style={styles.profileImageStyle}></Image>
            </TouchableOpacity>
          </View>
          </SafeAreaView>
          {/* Game Archive List */}
          <FlatList
            data={games}
            renderItem={renderItem}
            keyExtractor={item => item.gameID.toString()} // Replace with unique identifier
          />
          {/* <ScrollView style={styles.archiveList}>
          <FlatList
            data={games}
            renderItem={renderItem}
            keyExtractor={item => item.gameId.toString()} // Replace with unique identifier
          />
          {/* <ScrollView style={styles.archiveList}>
            {Array(10).fill(null).map((_, index) => (
              <TouchableOpacity key={index} style={styles.opponentItem} onPress={navToGame}>
                <Text style={styles.opponentName}>Opponent Name</Text>
                {index%3 == 0 && (
                    <View style={[styles.icon, styles.green]}>
                        <Text>+</Text>
                    </View>
                )}
                {index%3 == 1 && (
                    <View style={[styles.icon, styles.red]}>
                        <Text>-</Text>
                    </View>
                )}
                {index%3 == 2 && (
                    <View style={styles.icon}>
                        <Text>=</Text>
                    </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView> */}

			{/* Play Button */}
      <SafeAreaView style={globalStyles.safeArea}>
			<TouchableOpacity style={[globalStyles.generalButton, styles.playButton]} onPress={navToCamera}>
			<Text style={styles.playButtonText}>Take Picture</Text>
			</TouchableOpacity>
      <TouchableOpacity style={[globalStyles.generalButton, styles.playButton]} onPress={navToDebug}>
			<Text style={styles.playButtonText}>Debug</Text>
			</TouchableOpacity>
      </SafeAreaView>
		</View>
		
      );
};

export default Home;

const styles = StyleSheet.create({
  statusText: {
    color: 'black',
    fontWeight: 'bold',
  },
    container: {
      padding: 0,
      // paddingBottom: 20,
      // paddingTop: 30,
    },
    title: {
      textAlign: 'center',
      flex: 1,
      color: 'white',
      fontSize: 30,
      fontWeight: 'bold',
    },
    search: {
      flex: 2,
      backgroundColor: 'gray',
      borderRadius: 15,
      paddingHorizontal: 15,
      color: 'white',
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
      width: 30,
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      // marginLeft: 10,
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
    playButton: {
      margin: 20
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
      opacity: 0, // make the placeholder invisible
    },
  });
  