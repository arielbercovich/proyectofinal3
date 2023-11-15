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
                this.setState({ user: user[0] });
            });
    }

    logOut() {
        auth.signOut()
            .then(() => this.props.navigation.navigate('Login'))
            .catch((error) => console.log('error'));
    }

    eliminarPerfil() {
        !this.state.user
            ? console.log('No hay usuario para eliminar')
            : auth.signInWithEmailAndPassword(auth.currentUser.email, this.state.pass)
                .then(() => db.collection('users').doc(this.state.user.id).delete()
                    .then(() => {
                        const user = auth.currentUser;
                        user.delete();
                        this.setState({ modalVisible: false });
                        this.props.navigation.navigate('Register');
                    })
                    .catch((error) => this.setState({ errors: error }))
                );
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title="MI PERFIL" onLogout={() => this.logOut()} />
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({
                            modalVisible: !this.state.modalVisible
                        })
                    }}>
                    <Text style={styles.textModal}>Confirme su contraseña</Text>
                    <TextInput
                        style={styles.inputModal}
                        placeholder='Password'
                        keyboardType='default'
                        secureTextEntry={true}
                        onChangeText={text => this.setState({ errors: '', pass: text })}
                        value={this.state.pass}
                    />

                    {this.state.errors === ''
                        ? <TouchableOpacity style={styles.button} onPress={() => this.eliminarPerfil()}>
                            <Text style={styles.buttonText}>Borrar perfil</Text>
                        </TouchableOpacity>
                        : <Text style={styles.notificacion}>{this.state.errors.message}</Text>
                    }

                    <TouchableOpacity onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </Modal>

                {this.state.user
                    ? <View style={styles.profileContainer}>
                        <Image
                            style={styles.profileImage}
                            source={{ uri: this.state.user.data.foto }}
                            resizeMode="cover"
                        />
                        <View style={styles.profileTextContainer}>
                            <Text style={styles.username}>{this.state.user.data.username}</Text>
                            <Text style={styles.email}>{this.state.user.data.owner}</Text>
                            <Text style={styles.bio}>{this.state.user.data.bio}</Text>
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
        color: '#4CAF50',
        borderWidth: 2,
        borderColor: '#4CAF50',
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
});

export default MiPerfil;
