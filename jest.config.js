module.exports = {
    preset: 'react-native',
    setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx', 'node'],
    testMatch: [
        "<rootDir>/__tests__/*.(test).{js,jsx,ts,tsx}"
    ],
    testPathIgnorePatterns: [
        "/node_modules/"
    ],
    transformIgnorePatterns: [
    //   "node_modules/(?!(jest-)?react-native|@react-native|react-native-vector-icons|@react-native-community|@react-navigation/.*|@firebase/app|@firebase/auth|expo(nent)?|@expo(nent)?/.*|unimodules-permissions-interface/.*|@react-native/.*)"
        "node_modules/(?!(@react-native|react-native|react-native-vector-icons)/)"
    ]
  };
  