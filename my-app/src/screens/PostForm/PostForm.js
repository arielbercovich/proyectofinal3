import React, { Component } from 'react';
import { db, auth } from '../../firebase/config';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import MyCamera from '../../components/Camara/MyCamera';

class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textoPost: '',
            likes: [],
            photo: null, // Agrega un estado para almacenar la foto capturada
            fotoUrl: '',
            loadingPhoto: false
        };
    }

    cambiarPosteoBoton(value) {
        this.setState({
            loadingPhoto: value
        });
    }

    crearPost(owner, textoPost, fotoUrl, createdAt) {
        //const { photo } = this.state; // Obtén la foto capturada
        // Crear la colección 'posts' con los datos del post y la foto si está presente
        db.collection('posts')
            .add({
                owner: owner,
                textoPost: textoPost,
                fotoUrl: fotoUrl,
                likes: [],
                comentario: [],
                createdAt: createdAt,
            })
            .then((res) => {
                console.log(res);
                // Después de crear el post, redirigir a Home
                this.props.navigation.navigate('Home');
            })
            .catch((e) => console.log(e));
    }

    trearUrlDeFoto(url) {
        this.setState({
            fotoUrl: url
        });
    }

    render() {
        return (
            <View style={styles.formContainer}>
                <Text>New Post</Text>
                <MyCamera
                    style={styles.camera}
                    cambiarPosteoBoton={(value) => this.cambiarPosteoBoton(value)}
                    traerUrlDeFoto={(url) => this.trearUrlDeFoto(url)}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ textoPost: text })}
                    placeholder='Escribir...'
                    keyboardType='default'
                    value={this.state.textoPost}
                />
                {this.state.loadingPhoto == false && (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() =>
                            this.crearPost(auth.currentUser.email, this.state.textoPost, this.state.fotoUrl, Date.now())
                        }
                    >
                        <Text style={styles.textButton}>Postear</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 10,
        marginTop: 20,
    },
    camera: {
        flex: 10,  // Use flex to take up available space
        height: '100%%',  // Set the height to 50% of the available space
        aspectRatio: 1,  // Maintain the aspect ratio of the camera preview
        marginBottom: 10,  // Add marginBottom for spacing
    },
    input: {
        height: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#28a745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#28a745',
    },
    textButton: {
        color: '#fff',
    },
});

export default PostForm;
