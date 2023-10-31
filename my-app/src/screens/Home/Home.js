import react, { Component } from 'react';
import {TextInput, TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import { auth } from '../../firebase/config';

class Home extends Component {
    constructor(){
        super()
        this.state={
      
        }
    }

    logout(){
        auth.signOut();
         //Redirigir al usuario a la home del sitio.
        this.props.navigation.navigate('Login')
    }



    render(){
        return(
            <View>
                <Text>HOME</Text>
                <TouchableOpacity onPress={()=>this.logout()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'white',
    },


    flatList:{
        justifyContent:'space-between'
    },

    touchable:{
        padding: 4,
        backgroundColor: '#ccc',
        marginBottom: 10,
        borderRadius: 4,
    },

    touchableText:{
        fontWeight: 'bold'
    },
});



export default Home;