import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Search from '../../screens/Search/Search'; 
import Home from '../../screens/Home/Home';
import PostForm from '../../screens/PostForm/PostForm';
import Comments from '../../screens/Comentarios/Comentario';

const Tab = createBottomTabNavigator();

function Menu (){

    return(
        <Tab.Navigator>
            <Tab.Screen name='Home' component={Home}  options={ { headerShown: false }}/>
            <Tab.Screen name='New Post' component={PostForm}  options={ { headerShown: false }}/>
            <Tab.Screen name='Search' component={Search} options={{ headerShown: false }} />
            <Tab.Screen name='Comentario' component={Comments}  options={ { headerShown: false }}/>

        </Tab.Navigator>
    )
}


export default Menu;