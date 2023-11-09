import React, { Component } from 'react';
import { db, auth } from '../../firebase/config';
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import MyCamera from '../../components/Camara/MyCamera';

class PostForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textoPost: '',
            likes: [],
            photo: null, // Agrega un estado para almacenar la foto capturada
            fotoUrl: ''
        };
    }

    crearPost(owner, textoPost, createdAt, fotoUrl) {
        //const { photo } = this.state; // Obtén la foto capturada
        // Crear la colección 'posts' con los datos del post y la foto si está presente
        db.collection('posts')
            .add({
                owner: owner,
                textoPost: textoPost,
                createdAt: createdAt,
                likes: [],
                fotoUrl: fotoUrl, // Agrega la foto al post
            })
            .then((res) => console.log(res))
            .catch((e) => console.log(e));
    }

    trearUrlDeFoto(url){
        this.setState({
            fotoUrl:url
        })
    }

    render() {
        return (
            <View style={styles.formContainer}>
                <Text>New Post</Text>
                <MyCamera style={ styles.camera} trearUrlDeFoto={url=>this.trearUrlDeFoto(url)} /> {/* Agrega MyCamera para capturar una foto */}
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ textoPost: text })}
                    placeholder='Escribir...'
                    keyboardType='default'
                    value={this.state.textoPost}
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => this.crearPost(auth.currentUser.email, this.state.textoPost,this.state.fotoUrl, Date.now())}
                >
                    <Text style={styles.textButton}>Postear</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    formContainer: {
        paddingHorizontal: 10,
        marginTop: 20,
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
