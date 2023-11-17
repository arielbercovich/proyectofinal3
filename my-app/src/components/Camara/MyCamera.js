import React, { Component } from 'react';
import { Camera } from 'expo-camera';
import { storage } from '../../firebase/config';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

class MyCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissions: false,
            showCamera: true,
            urlTemporal: '',
        };
        this.metodosDeCamera = '';
    }

    componentDidMount() {
        Camera.requestCameraPermissionsAsync()
            .then(() =>
                this.setState({
                    permissions: true,
                })
            )
            .catch((error) => console.log(error));
    }

    sacarFoto() {
        this.metodosDeCamera
            .takePictureAsync()
            .then((foto) => {
                this.setState({
                    urlTemporal: foto.uri,
                    showCamera: false,
                });
            })
            .catch((e) => console.log(e));
    }

    guardarFoto() {
        fetch(this.state.urlTemporal)
            .then((res) => res.blob())
            .then((imagen) => {
                const refStorage = storage.ref(`photos/${Date.now()}.jpg`);
                refStorage
                    .put(imagen)
                    .then(() => {
                        refStorage.getDownloadURL().then((url) => this.props.onImageUpload(url));
                    })
                    .then(() => {
                        this.setState({
                            showCamera: false,
                        });
                    });
            })
            .catch((e) => console.log(e));
    }

    cancelar() {
        this.setState({
            urlTemporal: '',
            showCamera: true,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.permissions ? (
                    this.state.showCamera ? (
                        <View style={styles.cameraContainer}>
                            <Camera
                                style={styles.camera}
                                type={Camera.Constants.Type.front}
                                ref={(metodosDeCamera) => (this.metodosDeCamera = metodosDeCamera)}
                            >
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.captureButton} onPress={() => this.sacarFoto()} />
                                </View>
                            </Camera>
                        </View>
                    ) : (
                        <View style={styles.previewContainer}>
                            <Image style={styles.preview} source={{ uri: this.state.urlTemporal }} resizeMode="cover" />
                            <TouchableOpacity style={styles.button} onPress={() => this.cancelar()}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => this.guardarFoto()}>
                                <Text style={styles.buttonText}>Aceptar</Text>
                            </TouchableOpacity>
                        </View>
                    )
                ) : (
                    <Text style={styles.text}>No tengo permisos</Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    cameraContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    camera: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    captureButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 50, 
        padding: 20,
        alignSelf: 'center',
        margin: 20,
        borderWidth: 3,
        borderColor: '#fff',
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    preview: {
        width: '100%',
        height: '100%',
    },
    button: {
        backgroundColor: '#4CAF50',
        margin: 10,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        fontFamily: 'Raleway, sans-serif',
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    text: {
        marginTop: 20,
        fontWeight: 'bold',
        color: '#007BFF', 
        fontFamily: 'Raleway, sans-serif',
    },
});

export default MyCamera;
