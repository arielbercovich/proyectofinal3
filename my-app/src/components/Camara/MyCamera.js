import React, { Component } from "react";
import { Camera } from 'expo-camera';
import { View, Text, TouchableOpacity } from 'react-native';

class MyCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissions: false,
            photo: null, // Cambiado a null para manejar la foto capturada
        };
        this.metodosDeCamera = null; // Cambiado a null para referenciar los métodos internos del componente camera
    }

    componentDidMount() {
        // Pedir permiso para uso de hardware
        Camera.requestCameraPermissionsAsync()
            .then(({ status }) => {
                if (status === 'granted') {
                    this.setState({ permissions: true });
                } else {
                    console.log("No se otorgaron los permisos de la cámara.");
                }
            })
            .catch((e) => console.log(e));
    }

    takePicture = async () => {
        if (this.metodosDeCamera) {
            try {
                const photo = await this.metodosDeCamera.takePictureAsync();
                this.setState({ photo });
            } catch (error) {
                console.error("Error al tomar la foto:", error);
            }
        }
    };

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.permissions ? (
                    this.state.photo ? ( // Si se ha capturado una foto, muestra la foto
                        <View style={{ flex: 1 }}>
                            <Text>Foto capturada:</Text>
                            <Image source={{ uri: this.state.photo.uri }} style={{ flex: 1 }} />
                        </View>
                    ) : ( // Si no se ha capturado una foto, muestra la cámara
                        <Camera
                            type={Camera.Constants.Type.front}
                            ref={(metodosDeCamera) => (this.metodosDeCamera = metodosDeCamera)}
                            style={{ flex: 1 }}
                        />
                    )
                ) : (
                    <Text>No se otorgaron permisos de cámara.</Text>
                )}

                {this.state.photo ? null : (
                    <TouchableOpacity onPress={this.takePicture}>
                        <Text>Sacar foto</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

export default MyCamera;
