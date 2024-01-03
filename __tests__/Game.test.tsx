beforeEach(() => {
    global.fetch = jest.fn((url: string, options?: RequestInit) => {
      if (url.includes('updateGame')) {
        return Promise.resolve({
          json: () => Promise.resolve({ message: 'Game updated successfully' }),
          status: 200, 
        } as Response);
      }
      // i guess this handles the case where the url is not updateGame
      return Promise.reject(new Error(`Unmocked API call to ${url}`));
    }) as jest.Mock;
  });


jest.mock('@react-navigation/native', () => {
return {
    useNavigation: () => ({
    navigate: jest.fn(),
    }),
};
});


// interface ChessboardProps {
//     fen: string;
//     onMove: (move: any) => void;
//     ref?: React.Ref<any>; 
//     colors: {
//       black: string;
//       white: string;
//     };
//   }
  

// jest.mock('../app/components/AnalysisBar', () => 'AnalysisBar');
  
// jest.mock('react-native-picker-select', () => {
//     return function PickerMock(props) {
//       return (
//         <select
//           value={props.value}
//           onChange={e => props.onValueChange(e.currentTarget.value)}
//         >
//           {props.items.map(item => (
//             <option key={item.value} value={item.value}>
//               {item.label}
//             </option>
//           ))}
//         </select>
//       );
//     };
//   });
  


//   jest.mock('react-native-chessboard', () => {
//     const React = require('react');
//     const ChessboardMock = React.forwardRef<ChessboardProps, any>(({ fen, onMove, colors, ...props }, ref) => {
//       return (
//         <div {...props} ref={ref}>
//           Mock Chessboard: FEN = {fen}
//         </div>
//       );
//     });
  
//     return {
//       __esModule: true,
//       default: ChessboardMock,
//       Chessboard: ChessboardMock,
//     };
//   });
  
jest.mock('react-native-chessboard', () => {
  const React = require('react');
  const ChessboardMock = React.forwardRef(({ fen, onMove, colors, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        Mock Chessboard: FEN = {fen}
      </div>
    );
  });

  return {
    __esModule: true,
    default: ChessboardMock,
    Chessboard: ChessboardMock,
  };
});

jest.mock('react-native-gesture-handler', () => require('../RNGesHandler'));
  
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
  }));

  jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({
      currentUser: {
        email: 'qaz@qaz.com',
      },
    })),
    initializeApp: jest.fn(),
  }));

jest.mock('expo-file-system', () => {
return {
    downloadAsync: jest.fn(() => Promise.resolve({ uri: 'mock-uri' })),
};
});

jest.mock('expo-asset', () => ({
  Asset: {
    fromModule: jest.fn(),
  },
}));

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('react-native-picker-select', () => {
return function PickerMock(props) {
    return (
    <select
        value={props.value}
        onChange={e => props.onValueChange(e.currentTarget.value)}
    >
        {props.items.map(item => (
        <option key={item.value} value={item.value}>
            {item.label}
        </option>
        ))}
    </select>
    );
};
});

// jest.mock('react-native-gesture-handler', () => require('../RNGesHandler'));

const mockGame = {
    item: {
      email: 'qaz@qaz.com',
      moves: [
        'rnbakbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
        'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2',
        'rnbakbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
        'rnbakbnr/ppp2ppp/8/3pp3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq d6 0 3',
        'rnbakbnr/ppp2ppp/8/3Pp3/8/5N2/PPPP1PPP/RNBQKB1R b KQkq - 0 3',
        'rnbakbnr/ppp2ppp/8/3P4/4p3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4',
      ],
      title: 'Test Game',
      opponentName: 'Opponent',
      side: 'White',
      status: 'Playing',
      gameID: '12345',
    },
  };
  
import React from 'react';
import { render } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import Game from '../app/screens/Game';


describe('<Game />', () => {
  it('displays game information correctly', () => {
    const { getByText } = render(
        <NavigationContainer>
          <Game route={{ params: mockGame }} />
        </NavigationContainer>
      );

    expect(getByText('Test Game')).toBeTruthy();
    expect(getByText('Opponent')).toBeTruthy();
    expect(getByText('Playing')).toBeTruthy();

  });
});