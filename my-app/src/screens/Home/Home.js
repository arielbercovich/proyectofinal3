import React, { Component } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, FlatList, ScrollView, Image } from 'react-native';
import { db, auth } from '../../firebase/config';
import Post from '../../components/Post';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            listaPost: []
        };
    }

    componentDidMount() {
        // Traer datos
        db.collection('posts').onSnapshot(
            (posteos) => {
                let postsAMostrar = [];

                posteos.forEach((unPost) => {
                    postsAMostrar.push({
                        id: unPost.id,
                        datos: unPost.data(),
                    });
                });
                console.log(postsAMostrar);
                this.setState({
                    listaPost: postsAMostrar,
                });
            }
        );
    }

    logout() {
        auth.signOut();
        // Redirigir al usuario a la home del sitio.
        this.props.navigation.navigate('Login');
    }

    render() {
        console.log(this.state.listaPost);
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <Text>HOME</Text>
                <TouchableOpacity onPress={() => this.logout()}>
                    <Text>Logout</Text>
                </TouchableOpacity>
                <Text>Lista de Posts</Text>
                {this.state.listaPost.length === 0 ? (
                    <Text>Cargando...</Text>
                ) : (
                    <FlatList
                        data={this.state.listaPost}
                        keyExtractor={(unPost) => unPost.id}
                        renderItem={({ item }) => <Post propsNavegacion={this.props.navigation} infoPost={item} />}
                    />
                )}
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={() => this.props.navigation.navigate('Comentarios')}
                >
                </TouchableOpacity>
            </ScrollView>
        );
    }}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
    },

    flatList: {
        justifyContent: 'space-between',
    },

    touchable: {
        padding: 4,
        backgroundColor: '#ccc',
        marginBottom: 10,
        borderRadius: 4,
    },

    touchableText: {
        fontWeight: 'bold',
    }
});

export default Home;
