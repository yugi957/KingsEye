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
    getAuth: jest.fn(),
    sendPasswordResetEmail: jest.fn(),
    signOut: jest.fn(),
    //currentuser

  }));
  
// jest.mock('../FirebaseConfig', () => ({
//     FIREBASE_AUTH: {
//       currentUser: {
//         email: 'qaz@qaz.com', 
//       },
//     },
//   }));
  

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native'; 
import Profile from '../app/screens/Profile';


jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      email: 'qaz@qaz.com',
    },
  })),
}));

  
  

describe('<Profile />', () => {
  it('updates name fields correctly when editing', () => {
    const { getByText, getByTestId } = render(
        <NavigationContainer>
            <Profile />
        </NavigationContainer>
    );

    const editButton = getByTestId('editButton');
    fireEvent.press(editButton);

    const firstNameInput = getByTestId('firstNameInput');
    const lastNameInput = getByTestId('lastNameInput');
    fireEvent.changeText(firstNameInput, 'NewFirstName');
    fireEvent.changeText(lastNameInput, 'NewLastName');

    fireEvent.press(editButton);

    expect(getByText('NewFirstName')).toBeTruthy();
    expect(getByText('NewLastName')).toBeTruthy();
  });

});