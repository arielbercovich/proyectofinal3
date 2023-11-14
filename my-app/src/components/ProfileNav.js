import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Profile from '../screens/Profile';
import Home from '../screens/Home';
import Comments from '../screens/Comments'

const Stack = createNativeStackNavigator();

function ProfileNav() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Home" component={ Home } options={{headerShown: false}}/>
        <Stack.Screen name="Perfil" component={ Profile } options={{headerShown: false}}/>    
        <Stack.Screen name="Comments" component={ Comments } />  
    </Stack.Navigator>
  );
}

export default ProfileNav;