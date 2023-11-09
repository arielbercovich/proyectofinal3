import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { Component } from 'react';
import { useNavigation } from '@react-navigation/native'; // Importa useNavigation desde React Navigation
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

    render() {
        const navigation = useNavigation(); // Obtiene acceso a la navegación

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
                                    onPress={() => {
                                        navigation.navigate('Profile', { email: item.data.owner });
                                    }}
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
        marginTop: 0,
    },

    foto: {
        height: 200,
        width: 200,
        borderRadius: 50,
        padding: 5,
    },

    titulo: {
        fontFamily: 'Oswald, sans-serif',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        backgroundColor: '#926F5B',
        marginBottom: 70,
    },

    text: {
        color: '#926F5B',
        marginTop: 0,
        marginBottom: '10%',
        fontFamily: 'Raleway, sans-serif',
        fontSize: 25,
        marginLeft: 0,
        fontStyle: 'italic',
        borderWidth: 2,
        borderColor: '#926F5B',
        borderRadius: 4,
    },

    input: {
        height: 32,
        color: 'white',
        backgroundColor: '#D3B9AA',
        fontFamily: 'Oswald, sans-serif',
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
        marginBottom: '10%',
    },
    searchButton: {
        backgroundColor: '#926F5B',
        color: 'white',
        padding: 10,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
        borderRadius: 5,
    },
    
    notificacion: {
        color: '#926F5B',
        marginTop: 0,
        fontFamily: 'Raleway, sans-serif',
        fontSize: 20,
        marginLeft: 0,
        fontWeight: 'bold',
    },

    users: {
        color: '#926F5B',
        marginTop: 0,
        fontFamily: 'Raleway, sans-serif',
        fontSize: 24,
        marginLeft: 0,
        fontWeight: 'bold',
        flexDirecion: 'wrap',
        textAlign: 'center',
        textDecorationLine: 'underline',
    },

    view: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
    },

    nombre: {
        marginTop: 0,
        fontFamily: 'Raleway, sans-serif',
        fontSize: 18,
        color: '#926F5B',
        marginLeft: 0,
    },
});

export default Search;
