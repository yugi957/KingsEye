beforeEach(() => {
  global.fetch = jest.fn((url: string, options?: RequestInit) => {
    if (url.includes('getUser')) {
      return Promise.resolve({
        json: () => Promise.resolve({ profileImage: 'mockedImageUrl' }),
      } as Response);
    } else if (url.includes('setUserData')) {
      return Promise.resolve({
        json: () => Promise.resolve({ message: 'User data updated successfully' }),
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

jest.mock('expo-file-system', () => ({
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true })),
  readAsStringAsync: jest.fn(() => Promise.resolve('')),
  deleteAsync: jest.fn(() => Promise.resolve()),
  copyAsync: jest.fn(() => Promise.resolve()),
  moveAsync: jest.fn(() => Promise.resolve()),
  writeAsStringAsync: jest.fn(() => Promise.resolve()),
  makeDirectoryAsync: jest.fn(() => Promise.resolve()),
  readDirectoryAsync: jest.fn(() => Promise.resolve(['test.jpg'])),
}));

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ uri: 'test.jpg' })),
  launchCameraAsync: jest.fn(() => Promise.resolve({ uri: 'test.jpg' })),
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(() => Promise.resolve({ uri: 'test.jpg' })),
}));


import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import Profile from '../app/screens/Profile';


describe('<Profile />', () => {
  it('updates name fields correctly when editing', async () => {
    render(
      <NavigationContainer>
          <Profile />
      </NavigationContainer>
    );

    await waitFor(() => {
      const editButton = screen.getByTestId('editButton');
      fireEvent.press(editButton);

      const firstNameInput = screen.getByTestId('firstNameInput');
      const lastNameInput = screen.getByTestId('lastNameInput');
      fireEvent.changeText(firstNameInput, 'NewFirstName');
      fireEvent.changeText(lastNameInput, 'NewLastName');

      fireEvent.press(editButton);

      expect(screen.getByText('NewFirstName')).toBeTruthy();
      expect(screen.getByText('NewLastName')).toBeTruthy();
    });
  });

});