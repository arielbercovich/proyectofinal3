import React, { Component } from 'react';
import { Text, FlatList, View, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native';
import { db, auth } from '../../firebase/config';
import Post from '../../components/Post';

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
                let posts = docs.map((doc) => ({ id: doc.id, data: doc.data() }));
                this.setState({ posts });
            });

        currentUser && db.collection('users')
            .where('owner', '==', currentUser.email)
            .onSnapshot((docs) => {
                let user = docs.map((doc) => ({ id: doc.id, data: doc.data() }))[0];
                this.setState({ user });
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
            <View style={styles.scroll}>
                <Text style={styles.perfil}> PERFIL </Text>
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
                        ? <TouchableOpacity style={styles.text} onPress={() => this.eliminarPerfil()}>
                            <Text style={styles.logout}>Borrar perfil</Text>
                        </TouchableOpacity>
                        : <Text style={styles.notificacion}>{this.state.errors.message}</Text>
                    }

                    <TouchableOpacity onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                        <Text style={styles.logout}>Cancelar</Text>
                    </TouchableOpacity>
                </Modal>

                {this.state.user
                    ? <View style={styles.container}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}> Nombre de usuario: {this.state.user.data.username} </Text>
                            <Text style={styles.text}> Email: {this.state.user.data.owner} </Text>
                            <Text style={styles.text}> Biografía: {this.state.user.data.bio} </Text>
                        </View>
                        <Image
                            style={styles.foto}
                            source={{ uri: this.state.user.data.foto }} // Supongo que el campo 'foto' es una URL
                            resizeMode="cover"
                        />
                    </View>
                    : <Text> </Text>
                }

                <Text style={styles.text2}>Lista de sus {this.state.posts.length} posteos</Text>
                {this.state.posts.length === 0
                    ? <Text>No hay posteos disponibles</Text>
                    : <FlatList
                        style={styles.posts}
                        data={this.state.posts}
                        keyExtractor={(onePost) => onePost.id.toString()}
                        renderItem={({ item }) => <Post infoPost={item} navigation={this.props.navigation} />}
                    />
                }

                {this.state.user
                    ? (this.state.user.data.owner === auth.currentUser.email
                        ? <View>
                            <TouchableOpacity style={styles.text} onPress={() => this.logOut()}>
                                <Text style={styles.logout}>Log out</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.text} onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                                <Text style={styles.logout}>Eliminar Perfil</Text>
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
    scroll: {
        flex: 2,
    },

    perfil: {
        fontFamily: 'Oswald, sans-serif',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        backgroundColor: '#4CAF50', // Cambiado a verde similar al 'liked' en el Search
        marginBottom: 15,
        marginTop: 15,
    },

    text: {
        fontFamily: 'Oswald, sans-serif',
        color: 'white',
        fontSize: 20,
        flexDirection: 'column',
    },

    text2: {
        backgroundColor: 'white',
        color: 'black',
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    foto: {
        height: 75,
        width: 75,
        marginTop: 10,
        borderRadius: 50,
        padding: 5,
    },

    container: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#4CAF50', // Cambiado a verde similar al 'liked' en el Search
    },

    textContainer: {
        flexDirection: 'wrap',
        marginTop: 20,
    },

    logout: {
        backgroundColor: '#4CAF50', // Cambiado a verde similar al 'liked' en el Search
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },

    inputModal: {
        color: '#4CAF50', // Cambiado a verde similar al 'liked' en el Search
        borderWidth: 2,
        borderColor: '#4CAF50', // Cambiado a verde similar al 'liked' en el Search
        borderRadius: 4,
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 18,
        marginLeft: 0,
        fontStyle: 'italic',
    },

    textModal: {
        color: '#4CAF50', // Cambiado a verde similar al 'liked' en el Search
        fontSize: 20,
        fontWeight: 'bold',
        marginRight: '40%',
        width: '100%',
        fontFamily: 'Oswald, sans-serif',
        borderRadius: 4,
        marginTop: 10,
    },

    notificacion: {
        color: '#4CAF50', // Cambiado a verde similar al 'liked' en el Search
        marginTop: '15%',
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 20,
        marginLeft: 0,
    },
    posts:{
        textAlign: 'center',
        padding: 10,
        backgroundColor: 'white',
        },
  
});

export default MiPerfil