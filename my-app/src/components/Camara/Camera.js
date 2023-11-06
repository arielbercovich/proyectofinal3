import React, {Component} from "react";
import {Camera} from 'expo-camera';
import {db, storage} from '../../firebase/config';
import {TouchableOpacity, View, Text} from 'react-native'

class MyCamera extends Component{
constructor(props){
super(props)
this.state = {
    permissions: false,
    photo: '',// Url temporal interna de la foto 
    showCamera: true, 
}
this.metodosDeCamera = '' // referenciar a los metodos internos del componente camera
}
componentDidMount(){
    //pedir permiso para uso de hardware
    Camera.requestCameraPermissionAsync()
    .then(()=> {
        this.setState(
        {permissions: true})
    .catch(e => console.log(e))
        })
}

render(){
    return(
        <View></View>
        )
    
}
}

export default MyCamera