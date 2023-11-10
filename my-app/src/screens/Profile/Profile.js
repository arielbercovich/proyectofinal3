import React, { Component } from 'react';
import { Text, FlatList, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { db, auth } from '../../firebase/config';
import Post from '../../components/Post';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: [],
            currentEmail: '',
            posts: [],
            pass: '',
            errors: '',
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate() {
        const profileEmail = this.props.route.params.email;
    
        this.state.currentEmail === profileEmail
            ? null
            : this.setState({
                posts: [],
                user: [],
                currentEmail: profileEmail,
            });
    
        this.fetchData();
    }
    

    fetchData() {
        const profileEmail = this.props.route.params.email;

        db.collection('posts')
            .where('owner', '==', profileEmail)
            .onSnapshot((docs) => {
                let posts = [];
                docs.forEach((doc) => {
                    posts.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                    this.setState({
                        posts: posts,
                        currentEmail: profileEmail,
                    });
                });
            });

        db.collection('users')
            .where('owner', '==', profileEmail)
            .onSnapshot((docs) => {
                let user = [];
                docs.forEach((doc) => {
                    user.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                    this.setState({
                        user: user,
                    });
                });
            });
    }

    logOut() {
        auth
            .signOut()
            .then((res) => {
                this.props.navigation.navigate('Login');
            })
            .catch((error) => console.log('error'));
    }    

    delete() {
        this.state.user.length === 0
            ? console.log('')
            : auth
                  .signInWithEmailAndPassword(auth.currentUser.email, this.state.pass)
                  .then(() => {
                      db.collection('users')
                          .doc(this.state.user[0].id)
                          .delete()
                          .then(() => {
                              const user = firebase.auth().currentUser;
                              user.delete();
                              this.props.navigation.navigate('Register');
                          })
                          .catch((error) => console.log(error));
                  })
                  .catch((error) => this.setState({ errors: error }));
    }
    
    render() {
        return (
            <View style={styles.scroll}>
                <Text style={styles.perfil}> PERFIL </Text>

                {this.state.user.length === 0 ? (
                    <Text> </Text>
                ) : (
                    <View style={styles.container}>
                        <View style={styles.textContainer}>
                            <Text style={styles.text}> Nombre de usuario: {this.state.user[0].data.username} </Text>
                            <Text style={styles.text}> Email: {this.state.user[0].data.owner} </Text>
                            <Text style={styles.text}> Bibliografía: {this.state.user[0].data.bio} </Text>
                        </View>
                        <Image
                            style={styles.foto}
                            source={this.state.user[0].data.foto}
                            resizeMode="cover"
                        />
                    </View>
                )}

                <Text style={styles.text2}>
                    {this.state.posts.length > 0
                        ? `LISTA DE SUS ${this.state.posts.length} POSTEOS`
                        : 'NO SE ENCONTRARON POSTEOS PARA ESTE USUARIO'}
                </Text>
                
                 
                    <FlatList
                        data={this.state.posts}
                        keyExtractor={(onePost) => onePost.id.toString()}
                        renderItem={({ item }) => <Post postData={item} navigation={this.props.navigation} />}
                    />
               


                {this.state.user.length === 0 ? (
                    <Text> </Text>
                ) : this.state.user[0].data.owner === auth.currentUser.email ? (
                    <View>
                        <TouchableOpacity style={styles.text} onPress={() => this.logOut()}>
                            <Text style={styles.logout}>Log out</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.text} onPress={() => this.delete()}>
                            <Text style={styles.logout}>Eliminar Perfil</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <Text></Text>
                )}
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
});

export default Profile