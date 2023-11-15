import React, {Component} from 'react';
import { Camera } from 'expo-camera';
import {storage} from '../../firebase/config'
import { View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native'

class MyCamera extends Component {
    constructor (props){
        super (props)
        this.state={
            permissions: false,
            showCamera: true,
            urlTemporal:''
        }
        this.metodosDeCamera = ''
    }

    componentDidMount(){
        Camera.requestCameraPermissionsAsync()
        .then(() => this.setState(
            {
                permissions: true,
            }
        ))
        .catch (error=> console.log(error))
    }

    sacarFoto(){
        this.metodosDeCamera.takePictureAsync()
        .then(foto => {
            this.setState({
                urlTemporal: foto.uri,
                showCamera: false
            })
        })
        .catch(e => console.log(e))
    }

    guardarFoto(){
        fetch(this.state.urlTemporal) 
        .then(res=> res.blob())
        .then(imagen => {
            const refStorage = storage.ref(`photos/${Date.now()}.jpg`);
            refStorage.put(imagen)
            .then(()=>{
                refStorage.getDownloadURL()
                .then(url => this.props.onImageUpload(url))
            })
            .then(()=>{
                this.setState({
                    showCamera:false
            })
        })
        })
        .catch(e=> console.log(e))
    }

    cancelar(){
        this.setState({
            urlTemporal: '',
            showCamera:true
        }) 
    }

    render(){
        return (
            <View  style = { styles.cameraBody}>
                { this.state.permissions ?
                this.state.showCamera ?
                    <View  style = { styles.cameraBody} > 
                        <Camera
                            style = {styles.cameraBody}
                            type= {Camera.Constants.Type.front}
                            ref= {metodosDeCamera => this.metodosDeCamera = metodosDeCamera}
                        />
                        <TouchableOpacity style={styles.button} onPress= {()=>this.sacarFoto()}>
                            <Text style={styles.sacar}>Sacar foto</Text>
                        </TouchableOpacity>
                    </ View>
                    :
                    <View  style={styles.preview}>
                        <Image
                            style={styles.preview}
                            source={{uri: this.state.urlTemporal}}
                            resizeMode='cover'
                        />
                        <TouchableOpacity style={styles.button} onPress={()=> this.cancelar()}>
                            <Text style={styles.boton}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={()=> this.guardarFoto()}>
                            <Text style={styles.boton}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    <Text style={styles.text}> No tengo permisos</Text>
                }
            </View>
        )
    }
}

const styles= StyleSheet.create ({
    cameraBody: {
        height: '50vh',
        width: '100vw',
        position: 'absolute',
        marginTop:50
    },

 button: {
        height: '5%',
        width: '100%',
        padding: 5,
        marginTop: 10,
        backgroundColor: '#4CAF50', // Verde oscuro
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },

    boton: {
        height: '5%',
        padding: 5,
        marginTop: 20,
        backgroundColor: '#007BFF', // Azul vibrante
        textAlign: 'center',
        fontFamily: 'Raleway, sans-serif',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        borderRadius: 5,
    },

    preview: {
        height: '45%',
        marginTop: 50,
    },

    sacar: {
        backgroundColor: '#4CAF50', // Verde oscuro
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Raleway, sans-serif',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        borderRadius: 5,
        paddingVertical: 10,
    },

    text: {
        marginTop: 20,
        fontWeight: 'bold',
        color: '#007BFF', // Azul vibrante
        fontFamily: 'Raleway, sans-serif',
    },
});

export default MyCamera;