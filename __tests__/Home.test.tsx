beforeEach(() => {
    global.fetch = jest.fn((url: string, options?: RequestInit) => {
      console.log(`Mock fetch called with URL: ${url}`);

      if (url.includes('getUser')) {
        return Promise.resolve({
          json: () => Promise.resolve({ profileImage: 'mockedImageUrl' }),
        } as Response);
      } else if (url.includes('setUserData')) {
        return Promise.resolve({
          json: () => Promise.resolve({ message: 'User data updated successfully' }),
        } as Response);
      } else if (url.includes('getGames')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ pastGames: [{gameID: 1}, {gameID: 2}]}),
        } as Response);
      } else if (url.includes('updateGame')) {
        return Promise.resolve({
            json: () => Promise.resolve({ message: 'success' }),
        } as Response);
      } else if (url.includes('deleteGame')) {
        return Promise.resolve({
            json: () => Promise.resolve({ message: 'success' }),
        } as Response);
      }
      return Promise.resolve({
        json: () => Promise.resolve({}),
      } as Response);
    }) as jest.Mock;
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  jest.mock('firebase/app', () => ({
    initializeApp: jest.fn(),
  }));
  jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(() => ({
      currentUser: {
        email: 'qaz@qaz.com',
      },
    })),
  }));
  
    
jest.mock(
    'react-native-vector-icons/FontAwesome',
    () => 'dummy-icon',
);

import React from 'react';
import { render } from '@testing-library/react-native';
import Home from '../app/screens/Home';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';


describe('Home Screen Tests', () => {
  test('displays games', () => {
    const { queryByTestId, getByText, queryByText, debug } = render(<NavigationContainer><Home /></NavigationContainer>);
    expect(getByText('Game Archive')).toBeTruthy();
    expect(queryByText('No Saved Games!')).toBeFalsy();
    expect(queryByTestId('1')).toBeTruthy();
    expect(queryByTestId('2')).toBeTruthy();
    expect(queryByTestId('3')).toBeFalsy();
  });
});