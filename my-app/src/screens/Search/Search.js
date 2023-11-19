import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import React, { Component } from 'react';
import { db, auth } from '../../firebase/config';
import Header from '../../components/Header';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      usersFiltradoMail: [],
      textoUsuario: '',
      search: false,
    };
  }

  componentDidMount() {
    db.collection('users').onSnapshot((docs) => {
      let user = [];
      docs.forEach((doc) => {
        user.push({
          id: doc.id,
          data: doc.data(),
        });
        this.setState({
          users: user,
          loading: false,
        });
      });
    });
  }

  buscar(text) {
    this.setState({
      textoUsuario: text,
      search: text.length > 0,
      usersFiltradoMail: text == '' ? [] : this.state.users.filter((user) =>
        user.data.owner.toLowerCase().includes(text.toLowerCase()) ||
        user.data.username.toLowerCase().includes(text.toLowerCase())
      ),
    });
  }

  controlarCambios(text) {
    this.setState({
      textoUsuario: text,
    });
  }

  borrarBuscador() {
    this.setState({
      usersFiltradoMail: [],
      textoUsuario: '',
      search: false,
    });
  }
  logout(){
    auth.signOut();
     //Redirigir al usuario a la home del sitio.
    this.props.navigation.navigate('Login')
}


  render() {
    return (
      <View style={styles.scroll}>
        <Header title="BUSCADOR" onLogout={() => this.logout()} />
        <TextInput
          placeholder='Buscar perfil por nombre de usuario o correo'
          keyboardType='default'
          style={styles.text}
          onChangeText={(text) => this.controlarCambios(text)}
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
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Profile', { email: item.data.owner })}
                >
                  <View style={styles.view}>
                    <Text style={styles.nombre}>Usuario:</Text>
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
    color: 'white',
    fontWeight: 'bold',
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
  text: {
    color: 'black',
    marginTop: 55,
    marginBottom: 15,
    fontSize: 16,
    fontStyle: 'italic',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 5,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: 'lightgreen',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'center',  
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
    alignItems: 'center',
    justifyContent: 'center',
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
