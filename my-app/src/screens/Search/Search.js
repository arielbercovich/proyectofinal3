import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import { db, auth } from '../../firebase/config';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            usersFiltradoMail: [],
            textoUsuario: '',
            search: false
        };
    }

    componentDidMount() {
        db.collection('users').onSnapshot(docs => {
            let user = [];
            docs.forEach(doc => {
                user.push({
                    id: doc.id,
                    data: doc.data()
                });
                this.setState({
                    users: user,
                    loading: false
                });
            });
        });
    }

    buscar(text) {
        this.setState({
            textoUsuario: text,
            search: text.length > 0,
            usersFiltradoMail: text == ''
                ? []
                : this.state.users.filter(user =>
                    user.data.owner.toLowerCase().includes(text.toLowerCase()) ||
                    user.data.username.toLowerCase().includes(text.toLowerCase())
                )
        });
    }
    
    controlarCambios(text) {
        this.setState({
            textoUsuario: text
        });
    }

    borrarBuscador() {
        this.setState({
            usersFiltradoMail: [],
            textoUsuario: '',
            search: false
        });
    }

    render() {
        return (
            <View style={styles.scroll}>
                <Text style={styles.titulo}> BUSCADOR </Text>
                <TextInput
                    placeholder='Buscar perfil por nombre de usuario o correo'
                    keyboardType='default'
                    style={styles.text}
                    onChangeText={text => this.controlarCambios(text)}
                    value={this.state.textoUsuario}
                />

                <TouchableOpacity onPress={() => this.buscar(this.state.textoUsuario)}>
                    <Text style={styles.searchButton}>Buscar</Text>
                </TouchableOpacity>
                {this.state.usersFiltradoMail.length === 0 && this.state.search ? (
                    <Text style={styles.notificacion}>El perfil no existe</Text>
                ) : (
                    <View style={styles.container}>
                        <FlatList
                            data={this.state.usersFiltradoMail}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('Profile', { email: item.data.owner })}
                                >
                                    <View style={styles.view}>
                                        <Text style={styles.nombre}> Usuario: </Text>
                                        <Text style={styles.users}>{item.data.username}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        elevation: 3,
        alignItems: 'center', // Alinea los elementos en el centro
    },

    foto: {
        height: 200,
        width: 200,
        borderRadius: 100, // Un valor grande para hacer que la imagen sea circular
        marginBottom: 10,
    },

    titulo: {
        fontSize: 24,
        color: '#4CAF50', // Color verde similar al 'liked' en el Post
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },

    text: {
        color: '#4CAF50',
        marginTop: 0,
        marginBottom: 15,
        fontSize: 16,
        fontStyle: 'italic',
        borderWidth: 1,
        borderColor: '#4CAF50',
        borderRadius: 5,
        padding: 5,
        textAlign: 'center',
    },

    input: {
        height: 32,
        color: 'white',
        backgroundColor: '#4CAF50',
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        textAlign: 'center',
    },

    searchButton: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: 10,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        borderRadius: 5,
        marginBottom: 10,
    },

    notificacion: {
        color: '#4CAF50',
        marginTop: 0,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    users: {
        color: '#4CAF50',
        marginTop: 0,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textDecorationLine: 'underline',
        textAlign: 'center',
    },

    view: {
        flexDirection: 'row',
        alignItems: 'center', // Alinea los elementos en el centro
        justifyContent: 'center', // Centra horizontalmente los elementos
        marginBottom: 10,
    },

    nombre: {
        marginTop: 0,
        fontSize: 14,
        color: '#4CAF50',
        marginBottom: 10,
        textAlign: 'center',
    },
});

export default Search;