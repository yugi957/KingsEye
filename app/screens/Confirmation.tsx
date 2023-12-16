import { View, TouchableOpacity, Image, Text, StyleSheet, Dimensions, TextInput } from 'react-native';
import globalStyles from '../styles/globalStyles';
import HomeButton from '../components/HomeButton';
import React, { useState, useEffect, useRef } from 'react';
import Chessboard, {ChessboardRef} from 'react-native-chessboard-custom';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeIcon from '../../assets/homeIcon.png';
import RNPickerSelect from 'react-native-picker-select';
import { opponentPfp } from '../../assets/base64data_ts';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FIREBASE_AUTH } from '../../FirebaseConfig';


const screenWidth = Dimensions.get('window').width;
const buttonSize = screenWidth * 0.2;

export default function Confirmation({ navigation, route }) {
  const currentdate = new Date().toISOString();

  // const [fen, setFen] = useState('rn1qkbnr/pppb1Qpp/3p4/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4');
  const startingFen = route.params?.fen ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ";
  const chessboardRef = useRef<ChessboardRef>(null);
  const [gameTitle, setGameTitle] = useState(currentdate.slice(0, -5) + ' Game');
  const [blackPlayerName, setBlackPlayerName] = useState('Opponent');
  const [whitePlayerName, setWhitePlayerName] = useState('Opponent');
  const [opponentName, setOpponentName] = useState('Opponent');
  const [gameStatus, setGameStatus] = useState('Playing');
  const [isblackPlayerNameEditable, setIsblackPlayerNameEditable] = useState(false);
  const [iswhitePlayerNameEditable, setIswhitePlayerNameEditable] = useState(false);
  const [whitePlayerIcon, setWhitePlayerIcon] = useState(opponentPfp);
  const [blackPlayerIcon, setBlackPlayerIcon] = useState(opponentPfp);
  const [userSide, setUserSide] = useState('White');
  const [turn, setTurn] = useState('w');


	const navToHome = () => {
		navigation.navigate('Home')
	}

  const handleSave = () => {
    saveblackPlayerName();
    savewhitePlayerName();
    saveGame();
    navToHome();
  };

  const handleReject = () => {
    navigation.navigate('Camera');
  };


  const fbAuth = FIREBASE_AUTH;
  const saveGame = async () => {
    const fenArray = chessboardRef.current?.getState().fen.split(' ');
    let firstMove = fenArray[0] + " " + turn + " " + fenArray.slice(2, 6).join(' ');
    const saveData = {
      email: fbAuth.currentUser.email,
      opponent: opponentName,
      date: currentdate,
      title: gameTitle,
      status: gameStatus,
      moves: [firstMove],
      side: userSide,
      // notes: notes
      // IMPLEMENT NOTES LATER
    };

    try {
      const response = await fetch('https://kingseye-1cd08c4764e5.herokuapp.com/saveGame', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData),
      });

      const result = await response.json();
      if (response.status === 200) {
        alert('Game saved successfully');
      } else {
        alert('Error saving game: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while saving the game.');
    }
  };

  const toggleblackPlayerNameEdit = () => {
    setIsblackPlayerNameEditable(!isblackPlayerNameEditable);
    if (isblackPlayerNameEditable) {
      saveblackPlayerName();
    }
  };

  const togglewhitePlayerNameEdit = () => {
    setIswhitePlayerNameEditable(!iswhitePlayerNameEditable);
    if (iswhitePlayerNameEditable) {
      savewhitePlayerName();
    }
  };

  useEffect(() => {
    const userEmail = fbAuth.currentUser.email;
    const url = `https://kingseye-1cd08c4764e5.herokuapp.com/getUser?email=${userEmail}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        // Assuming basePfp is available and holds the other player's base64 image
        // Check the side and assign names and icons accordingly
        if (userSide === "White") {
          setWhitePlayerName(`${data.firstName} ${data.lastName}`);
          setBlackPlayerName(opponentName);opponentPfp
          setWhitePlayerIcon(data.profileImage);
          setBlackPlayerIcon(opponentPfp);
        } else if (userSide === "Black") {
          setBlackPlayerName(`${data.firstName} ${data.lastName}`);
          setWhitePlayerName(opponentName);
          setBlackPlayerIcon(data.profileImage);
          setWhitePlayerIcon(opponentPfp);
        }
      })
      .catch(error => console.error('Error:', error));
  }, [userSide]);

  // Save player names and exit edit mode
  const saveblackPlayerName = () => {
    if (blackPlayerName.trim().length === 0) {
      setBlackPlayerName('Player 1');
    }
    setOpponentName(blackPlayerName);
    setIsblackPlayerNameEditable(false);
  };

  const savewhitePlayerName = () => {
    if (whitePlayerName.trim().length === 0) {
      setWhitePlayerName('Player 2');
    }
    setOpponentName(whitePlayerName);
    setIswhitePlayerNameEditable(false);
  };


  // useEffect(() => {
  //   setFen(chessboardRef.current?.getState().fen);
  //   console.log("FEN", fen)
  // }, [chessboardRef.current?.getState().fen]);

  return (
	// <View style={[globalStyles.container, styles.container]}>
    <SafeAreaView style={[globalStyles.safeArea, styles.gameContainer]}>
      <View style={globalStyles.header}>
              <HomeButton navigation={navigation} onCustomPress={undefined} />
              <Text style={styles.confirmText}>Confirmation</Text>
              <View style={styles.IconStyleTransparent}></View>
      </View>      

      <View style={styles.playerTopInfo}>
          <Image source={{ uri: blackPlayerIcon }} style={styles.playerIcon} />
          {userSide === "White" ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isblackPlayerNameEditable ? (
                <TextInput
                  style={[styles.playerName, styles.editableName]}
                  onChangeText={setBlackPlayerName}
                  value={blackPlayerName}
                  autoFocus
                />
              ) : (
                <Text style={styles.playerName}>{blackPlayerName}</Text>
              )}
              <TouchableOpacity onPress={toggleblackPlayerNameEdit} style={styles.iconContainer}>
                <Icon name={isblackPlayerNameEditable ? "save" : "edit"} size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.playerName}>{blackPlayerName}</Text>
          )}
        </View>

        <View>
          <GestureHandlerRootView>
            <Chessboard
              // key={fen}
              fen={startingFen}
              ref={chessboardRef}
              colors={{ black: "#769656", white: "#eeeed2" }}
            />
          </GestureHandlerRootView>
        </View>


        <View style={styles.playerBottomInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: whitePlayerIcon }} style={styles.playerIcon} />
            {userSide === "Black" ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {iswhitePlayerNameEditable ? (
                  <TextInput
                    style={[styles.playerName, styles.editableName]}
                    onChangeText={setWhitePlayerName}
                    value={whitePlayerName}
                    autoFocus
                  />
                ) : (
                  <Text style={styles.playerName}>{whitePlayerName}</Text>
                )}
                <TouchableOpacity onPress={togglewhitePlayerNameEdit} style={styles.iconContainer}>
                  <Icon name={iswhitePlayerNameEditable ? "save" : "edit"} size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.playerName}>{whitePlayerName}</Text>
            )}
          </View>

          <View style={styles.statusContainer}>
            <Text style={{ color: 'white', marginRight: 5, fontSize: 12 }}>Status:</Text>
            <RNPickerSelect
              onValueChange={(value) => setGameStatus(value)}
              items={[
                { label: 'Playing', value: 'Playing' },
                { label: 'Win', value: 'Win' },
                { label: 'Draw', value: 'Draw' },
                { label: 'Loss', value: 'Loss' },
              ]}
              style={pickerSelectStyles}
              value={gameStatus}
              useNativeAndroidPickerStyle={false}
              placeholder={{}}
              Icon={() => {
                return <Icon name="chevron-down" size={8} color="white" />;
              }}
            />
          </View>
        </View>

        <View style={styles.buttonHorizontal}>
          <View style={styles.textInput}>
            <TextInput 
              style={styles.title}
              placeholder="Enter Title"
              value={gameTitle}
              onChangeText={setGameTitle}
            />
          </View>
          <View style={[styles.buttonContainer, styles.test]}>
            {['White', 'Black'].map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.inactiveButton,
                  index === 0 && styles.leftButton,
                  index === 1 && styles.rightButton,
                  (button == 'White' ? 'w' : 'b') === turn && styles.activeButton
                ]}
                onPress={() => setTurn(button == 'White' ? 'w' : 'b')}
              >
                <Text style={(button == 'White' ? 'w' : 'b') === turn ? styles.activeText : styles.inactiveText}>{button}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.test}>
            <TouchableOpacity
              style={[
                styles.inactiveButton,
                styles.leftButton,
                styles.rightButton,
              ]}
              onPress={() => setUserSide(userSide === 'White' ? 'Black' : 'White')}
            >
              <Text style={styles.inactiveText}>Switch</Text>
              {/* <Image style={styles.buttonImage} source={require('../../assets/rejectImage.png')} /> */}
            </TouchableOpacity>
          </View>
        </View>

	      <View style={styles.buttonHorizontal}>
          <View style={styles.buttonVertical}>
            <TouchableOpacity onPress={handleReject}>
              <Image style={styles.buttonImage} source={require('../../assets/rejectImage.png')} />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Cancel</Text>
          </View>
          <View style={styles.buttonVertical}>
            <TouchableOpacity onPress={handleSave}>
              <Image style={styles.buttonImage} source={require('../../assets/acceptImage.png')} />
            </TouchableOpacity>
            <Text style={styles.buttonText}>Save Game</Text>
          </View>
        </View>
    </SafeAreaView>
	// </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,           // Sets the thickness of the border
    borderColor: '#fff',      // Sets the color of the border
    borderRadius: 10,         // Rounds the corners
    padding: 3,              // Spacing between the text and the border  }
    width: Dimensions.get('window').width * .5,
  },
  test: {
    borderWidth: 1,           // Sets the thickness of the border
    borderColor: '#fff',      // Sets the color of the border
    borderRadius: 11,         // Rounds the corners
  },
  title: {
    fontSize: 14,
    color: 'white',
  },
  leftButton: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  rightButton: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  activeButton: {
    backgroundColor: '#d9d9d9', // highlighted color
  },
  activeText: {
    color: '#000',
  },
  inactiveText: {
    color: '#a3a3a3',
  },
  inactiveButton: {
    color: '#fff',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#2E2E2E', // dimmed color
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  	IconStyleTransparent: {
		width: 30,
		height: 30,
	},
  confirmText: {
    textAlign: 'center',
    flex: 1,
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: Dimensions.get('window').height * .01,
    top: 0
  },
  gameTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  centerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  editIconContainer: {
    marginLeft: 8,
  },
  homeIconStyle: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: '#2E2E2E',
    padding: 2,
  },
  playerIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  playerTopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
  },
  playerBottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 0,
  },
  statusContainer: {
    bottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // playerNameContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   padding: 10,
  // },
  editableName: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  editableTitle: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },
  iconContainer: {
    marginLeft: 8,
  },
  square: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  // controls: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginTop: 20,
  // },
  // button: {
  //   padding: 10,
  //   backgroundColor: '#000',
  //   marginHorizontal: 20,
  // },
  // buttonText: {
  //   color: '#fff',
  // },
  // IconStyle: {
  //   width: 15,
  //   height: 30,
  //   marginLeft: 10,
  // },
  tabArea: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    marginTop: Dimensions.get('window').height * .008,
    paddingBottom: Dimensions.get('window').height * .012
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: '#eee',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 0,
    backgroundColor: '#eee',
  },
  activeTab: {
    backgroundColor: '#789454',
  },
  tabText: {
    fontSize: 10,
    color: '#333',
    marginLeft: 5,
  },
  activeTabText: {
    color: '#fff',
  },
  tabContentContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height * .15,
  },
  firstTab: {
    borderTopLeftRadius: 10,
  },
  lastTab: {
    borderTopRightRadius: 10,
  },
  playerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonHorizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
  buttonVertical: {
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 10,
    },
  buttonText: {
		paddingLeft: 5,
		// paddingRight: 5,
		paddingBottom: 10,
		alignItems: 'center',
		margin:5,
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	buttonImage: {
        width: buttonSize,
        height: buttonSize,
	},
});

// const styles = StyleSheet.create({
// 	buttonHorizontal: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//     },
//     buttonVertical: {
//         flexDirection: 'column',
//         alignItems: 'center',
//         paddingBottom: 10,
//     },
// 	confirmText: {
// 		textAlign: 'center',
// 		flex: 1,
// 		color: 'white',
// 		fontSize: 30,
// 		fontWeight: 'bold',
// 	},
// 	container: {
// 		// flex: 1,
// 		alignItems: 'center',
// 		// justifyContent: 'center',
// 		// backgroundColor: '#2E2E2E',
// 	},
// 	buttonContainer: {
//     	flexDirection: 'row',
//     	marginTop: 20,
//   	},
// 	button: {
// 		marginHorizontal: 10,
// 		padding: 10,
// 		borderRadius: 5,
// 	},
// 	buttonText: {
// 		paddingLeft: 5,
// 		// paddingRight: 5,
// 		paddingBottom: 10,
// 		alignItems: 'center',
// 		margin:5,
// 		color: 'white',
// 		fontSize: 20,
// 		fontWeight: 'bold',
// 	},
// 	IconStyle: {
// 		width: 30,
// 		height: 30,
// 		marginLeft: 10,
// 	},
// 	IconStyleTransparent: {
// 		width: 30,
// 		height: 30,
// 	},
// 	buttonImage: {
//         width: buttonSize,
//         height: buttonSize,
// 	},
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 4,
//     marginBottom: Dimensions.get('window').height * .01,
//     top: 0
//   },
//   gameTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//   },
//   centerContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//   },
//   editIconContainer: {
//     marginLeft: 8,
//   },
//   homeIconStyle: {
//     width: 24,
//     height: 24,
//     resizeMode: 'contain',
//   },
//   gameContainer: {
//     flex: 1,
//     backgroundColor: '#2E2E2E',
//     padding: 10,
//   },
//   playerIcon: {
//     width: 30,
//     height: 30,
//     marginRight: 8,
//   },
//   playerTopInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//     width: '100%',
//     paddingTop: 10,
//     paddingBottom: 10,
//     paddingLeft: 0,
//   },
//   playerBottomInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     width: '100%',
//     paddingTop: 10,
//     paddingBottom: 10,
//     paddingLeft: 0,
//   },
//   statusContainer: {
//     bottom: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   editableName: {
//     borderBottomWidth: 1,
//     borderBottomColor: 'white',
//   },
//   editableTitle: {
//     borderBottomWidth: 1,
//     borderBottomColor: 'white',
//   },
//   iconContainer: {
//     marginLeft: 8,
//   },
//   square: {
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   tabArea: {
//     alignSelf: 'flex-start',
//     alignItems: 'flex-start',
//     marginTop: Dimensions.get('window').height * .008,
//     paddingBottom: Dimensions.get('window').height * .012
//   },
//   tabs: {
//     flexDirection: 'row',
//     justifyContent: 'flex-start',
//     backgroundColor: '#eee',
//     borderTopLeftRadius: 10,
//     borderTopRightRadius: 10,
//   },
//   tab: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingLeft: 8,
//     paddingRight: 8,
//     paddingTop: 5,
//     paddingBottom: 5,
//     borderBottomWidth: 0,
//     backgroundColor: '#eee',
//   },
//   activeTab: {
//     backgroundColor: '#789454',
//   },
//   tabText: {
//     fontSize: 10,
//     color: '#333',
//     marginLeft: 5,
//   },
//   activeTabText: {
//     color: '#fff',
//   },
//   tabContentContainer: {
//     padding: 10,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderBottomLeftRadius: 10,
//     borderBottomRightRadius: 10,
//     borderTopRightRadius: 10,
//     width: Dimensions.get('window').width - 20,
//     height: Dimensions.get('window').height * .15,
//   },
//   firstTab: {
//     borderTopLeftRadius: 10,
//   },
//   lastTab: {
//     borderTopRightRadius: 10,
//   },
//   playerName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: 'white',
//   }
// });

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 20,
    backgroundColor: 'transparent',
  },
  inputAndroid: {
    fontSize: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'white',
    paddingRight: 20,
    backgroundColor: 'transparent',
  },
  iconContainer: {
    top: 5,
    right: 8,
  },
});