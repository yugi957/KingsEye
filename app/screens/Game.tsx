import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, TextInput } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import Chessboard, { ChessboardRef } from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import globalStyles from '../styles/globalStyles';
import AnalysisBar from '../components/AnalysisBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import HomeIcon from '../../assets/homeIcon.png';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNPickerSelect from 'react-native-picker-select';
import { opponentPfp } from '../../assets/base64data_ts';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { Chess } from 'chess.js';

// BOOK BAGELMAKE ANDREWCHANG CANDYMANANDY SLOTHTURTLECORE TODO -
// 1) populate each of the tabs
//      i made this assuming the back and next arrows only being shown in the moves tab. probably want to highlight what move you are on or something
// 2) on click home Icon, maybe alert you have unsaved changes are you sure you want to go back?
// 3) add notes to api call 
// 4) auto change game status when stockfish text is 'checkmate in x'
// 5) i didnt show date in this screen because might not make sense to. but we most likely want to update it either way when we click save
//     for the purpose of sorting games on home screen.

const Game = ({ route }) => {

  const navigation = useNavigation();
	const navToHome = () => {
		navigation.navigate('Home')
	}

  // console.log(route.params)

  const initialFen = route.params.item.moves[0] ?? "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 "; // if no FEN is provided, but SHOULD NEVER HIT THIS CASE
  const [fen, setFen] = useState(initialFen);
  const [fenHistory, setFenHistory] = useState(route.params.item.moves ?? [initialFen]);
  console.log("initial: ", initialFen, "fen history", fenHistory)

  const fbAuth = FIREBASE_AUTH;

  //was merge conflict
  //const [fen, setFen] = useState(route.params.item.moves[0]);
  //const [fenHistory, setFenHistory] = useState(route.params.item.moves);
  const [moveHistory, setMoveHistory] = useState(findAllMoves(fenHistory));
  //was merge conflict
  
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const chessboardRef = useRef<ChessboardRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [gameTitle, setGameTitle] = useState(route.params.item.title);
  const [blackPlayerName, setBlackPlayerName] = useState('Loading...');
  const [whitePlayerName, setWhitePlayerName] = useState('Loading...');
  const [gameStatus, setGameStatus] = useState(route.params.item.status);
  const [isGameTitleEditable, setIsGameTitleEditable] = useState(false);
  const [isblackPlayerNameEditable, setIsblackPlayerNameEditable] = useState(false);
  const [iswhitePlayerNameEditable, setIswhitePlayerNameEditable] = useState(false);
  const [whitePlayerIcon, setWhitePlayerIcon] = useState(opponentPfp);
  const [blackPlayerIcon, setBlackPlayerIcon] = useState(opponentPfp);

  useEffect(() => {
    if (fenHistory.length == null) {
      setFenHistory([fen]);
    }
  }, []);

  const updateGameDetails = async () => {

    const updateData = {
      email: fbAuth.currentUser.email,
      gameID: route.params.item.gameID,
      moves: fenHistory,
      opponentName: route.params.item.side === "White" ? blackPlayerName : whitePlayerName,
      title: gameTitle,
      status: gameStatus,
      // notes: notes
    };

    try {
      const response = await fetch('https://kingseye-1cd08c4764e5.herokuapp.com/updateGame', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();
      if (response.status === 200) {
        alert('Game saved successfully');
      } else {
        alert('Error updating game: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while updating the game.');
    }
  };

  const handleSave = () => {
    saveGameTitle();
    saveblackPlayerName();
    savewhitePlayerName();
    updateGameDetails();
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
        if (route.params.item.side === "White") {
          setWhitePlayerName(`${data.firstName} ${data.lastName}`);
          setBlackPlayerName(route.params.item.opponentName);
          setWhitePlayerIcon(data.profileImage);
        } else if (route.params.item.side === "Black") {
          setBlackPlayerName(`${data.firstName} ${data.lastName}`);
          setWhitePlayerName(route.params.item.opponentName);
          setBlackPlayerIcon(data.profileImage);
        }
      })
      .catch(error => console.error('Error:', error));
  }, [route.params.item.side, route.params.item.opponentName]);

  const toggleGameTitleEdit = () => {
    setIsGameTitleEditable(!isGameTitleEditable);
  };

  const saveGameTitle = () => {
    if (gameTitle.length != 0) {
      setIsGameTitleEditable(false);
    }
  };

  // Save player names and exit edit mode
  const saveblackPlayerName = () => {
    if (blackPlayerName.trim().length === 0) {
      setBlackPlayerName('Player 1');
    }
    setIsblackPlayerNameEditable(false);
  };

  const savewhitePlayerName = () => {
    if (whitePlayerName.trim().length === 0) {
      setWhitePlayerName('Player 2');
    }
    setIswhitePlayerNameEditable(false);
  };

  // Function to render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
      {
        const formattedMoves = moveHistory.map((move, index) => `${index + 1}. ${move}`);
        return (
          <View style={styles.movesContainer}>
            {moveHistory.map((move, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.button} 
                onPress={() => setCurrentMoveIndex(index)}
              >
                <Text style={styles.moveText}>{`${index + 1}. ${move}`}</Text>
              </TouchableOpacity>
            ))}
          </View>
          // <Text style={[styles.tabContent, styles.moveText]}>{formattedMoves.join('  ')}</Text>
        );
      }
        
      case 1:
        return <AnalysisBar fen={fen}></AnalysisBar>;
        // return <Text style={styles.tabContent}>Analysis</Text>;
      case 2:
        return <Text style={styles.tabContent}>Notes notes</Text>;
    }
  };


  function parseFEN(fen) {
      const board = [];
      const rows = fen.split(' ')[0].split('/');

      rows.forEach(row => {
          const newRow = [];
          for (const char of row) {
              if (isNaN(char)) {
                  newRow.push(char);
              } else {
                  for (let i = 0; i < parseInt(char, 10); i++) {
                      newRow.push(null);
                  }
              }
          }
          board.push(newRow);
      });

      return board;
  }

  function findMove(fenBefore, fenAfter) {
      const boardBefore = parseFEN(fenBefore);
      const boardAfter = parseFEN(fenAfter);

      let from = '';
      let to = '';

      for (let r = 0; r < 8; r++) {
          for (let c = 0; c < 8; c++) {
              if (boardBefore[r][c] !== boardAfter[r][c]) {
                  const square = String.fromCharCode(97 + c) + (8 - r);
                  if (boardBefore[r][c] && !boardAfter[r][c]) {
                      from = square;
                  } else if (!boardBefore[r][c] && boardAfter[r][c]) {
                      to = square;
                  }
              }
          }
      }

      return from + to;
  }

  function findAllMoves(fenList) {
    const moves = ["Start"];
    for (let i = 0; i < fenList.length - 1; i++) {
        const move = findMove(fenList[i], fenList[i + 1]);
        moves.push(move);
    }
    return moves;
  }

  const onMove = ({ state }) => {
    console.log(state);
    console.log(fenHistory, currentMoveIndex);
    // Update the FEN history by removing FENs after the current index and appending the new FEN
    const newHistory = fenHistory.slice(0, currentMoveIndex + 1);
    newHistory.push(state.fen);

    setFenHistory(newHistory);
    setCurrentMoveIndex(newHistory.length - 1);
    setMoveHistory(findAllMoves(newHistory));

    console.log(fenHistory, currentMoveIndex);
  };
  
  useEffect(() => {
    setFen(fenHistory[currentMoveIndex]);
  }, [currentMoveIndex]);

  useEffect(() => {
    chessboardRef?.current?.resetBoard(fen);
  }, [fen]);

  return (
    <SafeAreaView style={styles.gameContainer}>
      <View style={styles.square}>
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={navToHome} >
            <Image source={HomeIcon} style={styles.homeIconStyle} />
          </TouchableOpacity>

          <View style={styles.centerContainer}>
            {isGameTitleEditable ? (
              <TextInput
                style={[styles.gameTitle, styles.editableTitle]}
                onChangeText={setGameTitle}
                value={gameTitle}
                placeholder=""
                autoFocus
              />
            ) : (
              <Text style={styles.gameTitle}>{gameTitle}</Text>
            )}
            <TouchableOpacity onPress={toggleGameTitleEdit} style={styles.editIconContainer}>
              <Icon name="edit" size={15} color="#fff" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSave}>
            <Icon name="save" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.playerTopInfo}>
          <Image source={{ uri: blackPlayerIcon }} style={styles.playerIcon} />
          {route.params.item.side === "White" ? (
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
              fen={fen}
              onMove={onMove}
              ref={chessboardRef}
              colors={{ black: "#769656", white: "#eeeed2" }}
            />
          </GestureHandlerRootView>
        </View>


        <View style={styles.playerBottomInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: whitePlayerIcon }} style={styles.playerIcon} />
            {route.params.item.side === "Black" ? (
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

        <View style={styles.tabArea}>
          <View style={styles.tabs}>
            {['Moves', 'Analysis', 'Notes'].map((tab, index, arr) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === index && styles.activeTab,
                  index === 0 && styles.firstTab,
                  index === arr.length - 1 && styles.lastTab
                ]}
                onPress={() => setActiveTab(index)}
              >
                <Icon
                  name={index === 0 ? "history" : index === 1 ? "line-chart" : "sticky-note"}
                  size={15}
                  color={activeTab === index ? "#fff" : "#333"}
                />
                <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tabContentContainer}>
            {renderTabContent()}
          </View>
        </View>

        {/* <AnalysisBar fen={fen}></AnalysisBar>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={undoMove}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={redoMove}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
};


export default Game;

const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  movesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  button: {
    margin: 2,
  },
  moveText: {
    color: '#fff',
    flexWrap: 'wrap',
  },
  tabContent: {
    color: '#fff',
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
    padding: 10,
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
  // playerInfoContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   padding: 10,
  // },
  // playerInfo: {
  //   alignItems: 'center',
  // },
  // profilePic: {
  //   width: 50,
  //   height: 50,
  //   borderRadius: 25,
  // },
  // dropdownStyle: {
  //   backgroundColor: '#fff',
  //   width: 60,
  //   height: 20,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   borderRadius: 5,
  // },
  // dropdownTextStyle: {
  //   fontSize: 14,
  //   color: '#333',
  // },
  // dropdownDropdownStyle: {
  //   width: 60,
  //   marginTop: 10,
  // },
});

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