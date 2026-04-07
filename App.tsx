import { LogBox, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Home from './app/screens/Home';
import Profile from './app/screens/Profile';
import Game from './app/screens/Game';
import Confirmation from './app/screens/Confirmation';
import DebugComponent from './app/screens/Debug';
import Camera from './app/screens/Camera';

LogBox.ignoreAllLogs(true);

const Stack = createNativeStackNavigator();

// DEMO BRANCH: Skip Login/Signup — auto-logged in as Demo User.
// Camera screen: uses hardware camera on native; file picker on web.

export default function App() {
  const [fontsLoaded] = useFonts({
    ...FontAwesome.font,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, maxHeight: 812, alignSelf: 'center', width: '100%', maxWidth: 480, overflow: 'hidden' }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Game" component={Game} />
            <Stack.Screen name="Debug" component={DebugComponent} />
            <Stack.Screen name="Confirmation" component={Confirmation} />
            <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}
