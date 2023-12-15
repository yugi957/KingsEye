module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'node'],
    testMatch: [
        "<rootDir>/__tests__/*.(test).{js,jsx,ts,tsx}"
    ],
    testPathIgnorePatterns: [
        "/node_modules/"
    ]
  };
  