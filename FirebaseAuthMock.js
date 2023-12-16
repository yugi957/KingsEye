const mockUser = {
    // uid: 'some-unique-id',
    email: 'qaz@qaz.com',
  };
  
  const signInWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: mockUser }));
  const createUserWithEmailAndPassword = jest.fn(() => Promise.resolve({ user: mockUser }));
  const signOut = jest.fn(() => Promise.resolve());  
  
  module.exports = {
    getAuth: jest.fn(() => ({
      signInWithEmailAndPassword,
      createUserWithEmailAndPassword,
      signOut,
      currentUser: mockUser,
    })),
  };
  