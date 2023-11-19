import React, { Component } from 'react';
import { Text, FlatList, View, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { db, auth } from '../../firebase/config';
import Post from '../../components/Post';
import Header from '../../components/Header';

class MiPerfil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            posts: [],
            pass: '',
            errors: '',
            modalVisible: false,
            editing: false,
            newUsername: '',
            newEmail: '',
            newBio: '',
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        (prevProps.route.params?.email !== this.props.route.params?.email) && this.fetchData();
    }

    fetchData() {
        const currentUser = auth.currentUser;

        currentUser && db.collection('posts')
            .where('owner', '==', currentUser.email)
            .orderBy('createdAt', 'desc')
            .onSnapshot((docs) => {
                let posts = []
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                this.setState({ posts: posts });
            });

        currentUser && db.collection('users')
            .where('owner', '==', currentUser.email)
            .onSnapshot((docs) => {
                let user = []
                docs.forEach(doc => {
                    user.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                this.setState({
                    user: user[0],
                    newUsername: user[0]?.data.username || '',
                    newBio: user[0]?.data.bio || '',
                });
            });
    }

    logOut() {
        auth.signOut()
            .then(() => this.props.navigation.navigate('Login'))
            .catch((error) => console.log('error'));
    }


    saveChanges() {
        const { newUsername, newBio } = this.state;

        if (newUsername.trim() === '') {
            this.setState({ errors: 'El nombre de usuario no puede estar vacío' });
        } else {
            db.collection('users').doc(this.state.user.id).update({
                username: newUsername,
                bio: newBio,
            })
            .then(() => {
                this.setState({
                    editing: false,
                    errors: '',
                });
            })
            .catch(error => {
                this.setState({ errors: error.message });
            });
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title="MI PERFIL" onLogout={() => this.logOut()} />

                {this.state.user
                    ? <View style={styles.profileContainer}>
                        
                        <View style={styles.profileTextContainer}>
                            {this.state.editing ? (
                                <View>
                                    <Text style={styles.username}>Nuevo nombre de usuario:</Text>
                                    <TextInput
                                        style={styles.inputModal}
                                        placeholder="Nuevo nombre de usuario"
                                        onChangeText={(text) => this.setState({ newUsername: text })}
                                        value={this.state.newUsername}
                                    />
                                    <br></br>
                                    <Text style={styles.username}>Nueva bio:</Text>
                                    <TextInput
                                        style={styles.inputModal}
                                        placeholder="Nueva bio"
                                        onChangeText={(text) => this.setState({ newBio: text })}
                                        value={this.state.newBio}
                                    />
                                    <TouchableOpacity style={styles.ebutton} onPress={() => this.saveChanges()}>
                                        <Text style={styles.buttonText}>Confirmar Cambios</Text>
                                    </TouchableOpacity>
                                    {this.state.errors !== '' && (
                                        <Text style={styles.notificacion}>{this.state.errors}</Text>
                                    )}
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.username}>{this.state.user.data.username}</Text>
                                    <Text style={styles.email}>{this.state.user.data.owner}</Text>
                                    <Text style={styles.bio}>{this.state.user.data.bio}</Text>
                                    <Image
                                        style={styles.foto}
                                        source={this.state.user.data.foto}
                                        resizeMode='cover'
                                        />
                                    <TouchableOpacity
                                        style={styles.ebutton}
                                        onPress={() => this.setState({ editing: true })}
                                    >
                                        <Text style={styles.buttonText}>Editar Perfil</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>
                    : <Text> </Text>
                }

                <Text style={styles.postHeading}>Lista de sus {this.state.posts.length} posteos</Text>
                {this.state.posts.length === 0
                    ? <Text>No hay posteos disponibles</Text>
                    : <FlatList
                        style={styles.posts}
                        data={this.state.posts}
                        keyExtractor={(onePost) => onePost.id.toString()}
                        renderItem={({ item }) => <Post postData={item} navigation={this.props.navigation} />}
                    />
                }

                {this.state.user
                    ? (this.state.user.data.owner === auth.currentUser.email
                        ? <View>
                            <TouchableOpacity style={styles.button} onPress={() => this.logOut()}>
                                <Text style={styles.buttonText}>Cerrar sesión</Text>
                            </TouchableOpacity>

                        </View>
                        : <Text></Text>
                    )
                    : <Text></Text>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
        paddingHorizontal: 15,
    },
    profileContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    profileImage: {
        height: 75,
        width: 75,
        borderRadius: 50,
    },
    profileTextContainer: {
        marginLeft: 15,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    username: {
        fontFamily: 'Oswald, sans-serif',
        color: '#333',
        fontSize: 20,
        fontWeight: 'bold',
    },
    email: {
        fontFamily: 'Oswald, sans-serif',
        color: '#555',
        fontSize: 16,
        marginTop: 5,
    },
    bio: {
        fontFamily: 'Oswald, sans-serif',
        color: '#555',
        fontSize: 16,
        marginTop: 5,
    },
    button: {
        backgroundColor: 'red',
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 8,
    },
    ebutton: {
        backgroundColor: 'gray',
        marginTop: 10,
        paddingVertical: 10,
        borderRadius: 8,
    },
    buttonText: {
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
    },
    textModal: {
        color: '#4CAF50',
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: '40%',
        width: '100%',
        fontFamily: 'Oswald, sans-serif',
        borderRadius: 4,
        marginTop: 10,
    },
    inputModal: {
        color: 'black',
        borderWidth: 2,
        borderColor: 'darkgray',
        borderRadius: 4,
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 18,
        marginLeft: 0,
        fontStyle: 'italic',
    },
    notificacion: {
        color: '#4CAF50',
        marginTop: '15%',
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 20,
        marginLeft: 0,
    },
    postHeading: {
        backgroundColor: 'white',
        color: '#333',
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 15,
    },
    posts: {
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    foto:{
        height:75,
        width:75,
        marginTop: 10,
        borderRadius:'50%',
        padding: 5,
    }
});

export default MiPerfil;
