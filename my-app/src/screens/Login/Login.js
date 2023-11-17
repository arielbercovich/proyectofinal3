import React, { Component } from 'react';
import { auth } from '../../firebase/config';
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Header from '../../components/Header';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            error: null, 
            recordarme: false
        };
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            if (user) {
                this.props.navigation.navigate('Menu');
              
            }
        });
    }

    login(email, pass) {
        auth.signInWithEmailAndPassword(email, pass)
            .then(response => {
                // Cuando Firebase responde sin error
                console.log('Login ok', response);


                // Redirigir al usuario a la home del sitio.
                this.props.navigation.navigate('Menu');
            })
            .catch(error => {
                // Cuando Firebase responde con un error.
                console.log({ error });
                this.setState({ error }); 
            });
    }
    recordarme(){
      this.setState({recordarme: !recordarme})
    }

    render() {
        return (
            <View style={styles.formContainer}>
                <Header title="INICIA SESIÓN" showLogout={false} />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ error: null, email: text })}
                    placeholder='Email'
                    keyboardType='email-address'
                    value={this.state.email}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ error: null, password: text })}
                    placeholder='Password'
                    keyboardType='default'
                    secureTextEntry={true}
                    value={this.state.password}
                />
                {this.state.error === null ? (
                    <TouchableOpacity style={styles.button} onPress={() => this.login(this.state.email, this.state.password)}>
                        <Text style={styles.textButton}>Iniciar sesión</Text>
                    </TouchableOpacity>
                ) : (
                    <View>
                        <Text style={styles.errorMessage}>{this.state.error.message}</Text>
                    </View>
                )}


                <TouchableOpacity onPress={() => this.props.navigation.navigate('Registro')}>
                    <Text style={styles.registro}>
                        ¿No tenés una cuenta? Registrate
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    inicioSesion: {
      borderColor: 'grey',
      borderStyle: 'solid',
      borderWidth: 1,
      marginLeft: 50,
      marginTop: 30,
      marginRight: 50,
      borderRadius: 20,
      minHeight: 'auto',
      backgroundColor: 'white',
    },
  
    campos: {
      alignItems: "center", 
      marginBottom: 50,
      padding: 10,
    },
  
  
    button: {
      backgroundColor: "#405DE6",
      marginHorizontal: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
      textAlign: "center",
      borderRadius: 4,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#fff",
      width: '90%',
      marginTop: 20,
    },
  
    textButton: {
      color: "#fff",
    },
  
    input: {
      marginTop: 5,
      marginBottom: 5,
      borderColor: 'grey',
      borderStyle: 'solid',
      borderWidth: 1,
      width: '90%',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 4,
    },
  
    regis:{
      marginHorizontal: 10,
      marginTop: 5,
      marginBottom: 5,
    },
  
    registro: {
      color: "#405DE6",
    },
  
    errorMessage: {
      color: 'red',
    }
  
  });

export default Login;