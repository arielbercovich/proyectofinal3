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
                <View style={styles.header}>
                <Text style={styles.title}>HOME 🏠</Text>
                    <Text style={styles.title}>rubrober.com </Text>

                    <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionTitle}>Lista de Posts</Text>
                {this.state.listaPost.length === 0 ? (
                    <Text style={styles.loadingText}>Cargando...</Text>
                ) : (
                    <FlatList
                        data={this.state.listaPost}
                        keyExtractor={(unPost) => unPost.id.toString()}
                        renderItem={({ item }) => <Post propsNavegacion={this.props.navigation} infoPost={item.datos} />}
                    />
                )}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => this.props.navigation.navigate('Comentarios')}
                >
                </TouchableOpacity>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#3498db',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        padding: 10,
        borderRadius: 5,
    },
    logoutButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 15,
        color: '#333',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#555',
    },
    addButton: {
        backgroundColor: '#3498db',
        borderRadius: 25,
        width: 50,
        height: 50,
        position: 'absolute',
        bottom: 20,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonIcon: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default Home;

