import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Register from './src/screens/Register/Register';
import Profile from './src/screens/Profile/Profile'
import Login from './src/screens/Login/Login';
import Home from './src/screens/Home/Home';
import Menu from './src/components/Menu/Menu';
import MiPerfil from './src/screens/MIPerfil/MiPerfil';
import Comments from './src/screens/Comentarios/Comentario';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer style={styles.container}>
    <Stack.Navigator>
      <Stack.Screen name='Login' component={Login} options={ { headerShown: false } }/>
      <Stack.Screen name='Registro' component={Register} options={ { headerShown: false } }/>
      <Stack.Screen name='Menu' component={Menu} options={ { headerShown: false } }/>
      <Stack.Screen name='Comentario' component={Comments}/>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MiPerfil" component={MiPerfil} />



      {/* Si implementamos tabnavigation para el resto de la app. El tercer componente debe ser una navegación que tenga a Home como primer screen */}
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
