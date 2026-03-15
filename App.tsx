import { LogBox } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import Game from './app/screens/Game';
import Confirmation from './app/screens/Confirmation';
import DebugComponent from './app/screens/Debug';

LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator();

// DEMO BRANCH: Skip Login/Signup — auto-logged in as Demo User.
// Camera screen removed (requires device hardware).

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Game" component={Game} />
        <Stack.Screen name="Debug" component={DebugComponent} />
        <Stack.Screen name="Confirmation" component={Confirmation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
