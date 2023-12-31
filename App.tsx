import { LogBox } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './app/screens/Login';
import Signup from './app/screens/Signup';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import Game from './app/screens/Game';
import Camera from './app/screens/Camera';
import Confirmation from './app/screens/Confirmation';
import DebugComponent from './app/screens/Debug';

LogBox.ignoreAllLogs(true);

// console.disableYellowBox = true;

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
        <Stack.Screen name = "Login" component={Login} />
        <Stack.Screen name = "Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="Camera" component={Camera} />
        <Stack.Screen name="Debug" component={DebugComponent} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}