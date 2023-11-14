import React, { Component } from "react";
import { Camera } from 'expo-camera';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { db, storage } from '../../firebase/config';

class MyCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permisos: false,
            urlInternaFoto: '',
            mostrarCamara: true,
        };
        this.metodosDeCamara = '';
    }

    componentDidMount() {
        // Pedir permiso para uso de hardware
        Camera.requestCameraPermissionsAsync()
            .then(() => {
                this.setState({
                    permisos: true,
                });
            })
            .catch((e) => console.log(e));
    }

    SacarFoto() {
        console.log('sacando foto...');
        this.metodosDeCamara.takePictureAsync()
            .then(photo => {
                this.setState({
                    urlInternaFoto: photo.uri,
                    mostrarCamara: false,
                });
            })
            .catch(e => console.log(e));
    }

    guardarFoto() {
        this.props.cambiarPosteoBoton(true);
        fetch(this.state.urlInternaFoto)
            .then(res => res.blob())
            .then(image => {
                const ruta = storage.ref(`photos/${Date.now()}.jpg`);
                ruta.put(image)
                    .then(() => {
                        ruta.getDownloadURL()
                            .then(url => {
                                this.props.traerUrlDeFoto(url);
                                this.setState({
                                    urlInternaFoto: '',
                                });
                                this.props.cambiarPosteoBoton(false);
                            });
                    });
            })
            .catch(e => console.log(e));
    }

    clearPicture() {
        this.setState({
            foto: '',
            mostrarCamara: true,
        });
    }

    render() {
        return (
            <View style={styles.cameraBody}>
                {
                    this.state.permisos ?
                        this.state.mostrarCamara === false ?
                            <React.Fragment>
                                <Image
                                    source={{ uri: this.state.urlInternaFoto }}
                                    style={styles.cameraImage}
                                />
                                <View style={styles.cameraButtons}>
                                    <TouchableOpacity
                                        style={styles.cameraButton}
                                        onPress={() => this.guardarFoto()}
                                    >
                                        <Text style={styles.buttonText}>Aceptar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.cameraButton}
                                        onPress={() => this.clearPicture()}
                                    >
                                        <Text style={styles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Camera
                                    type={Camera.Constants.Type.front}
                                    ref={metodosDeCamara => this.metodosDeCamara = metodosDeCamara}
                                    style={styles.cameraBody}
                                />
                                <TouchableOpacity style={styles.cameraButton} onPress={() => this.SacarFoto()}>
                                    
                                </TouchableOpacity>
                            </React.Fragment>

                        :
                        <Text>No se otorgaron permisos de cámara.</Text>
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    cameraBody: {
        height: 200,
        width: '100%',
        position: 'relative',
    },
    cameraImage: {
        height: 200,
        width: '100%',
    },
    cameraButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 10,
    },
    cameraButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default MyCamera;
