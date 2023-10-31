import react, { Component } from 'react';
import { auth } from '../../firebase/config';
import {TextInput, TouchableOpacity, View, Text, StyleSheet} from 'react-native';

class Login extends Component {
    constructor(){
        super()
        this.state={
            email:'',
            password:''
        }
    }

    login (email, pass){
        auth.signInWithEmailAndPassword(email, pass)
            .then( response => {
                //Cuando firebase responde sin error
                console.log('Login ok', response);

                //Cambiar los estados a vacío como están al inicio.


                //Redirigir al usuario a la home del sitio.
                this.props.navigation.navigate('Menu')

            })
            .catch( error => {
                //Cuando Firebase responde con un error.
                console.log(error);
            })
    }

    render(){
        return(
            <View style={styles.formContainer}>
                <Text>Login</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({email: text})}
                    placeholder='email'
                    keyboardType='email-address'
                    value={this.state.email}
                    />
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({password: text})}
                    placeholder='password'
                    keyboardType='default'
                    secureTextEntry={true}
                    value={this.state.password}
                />
                <TouchableOpacity style={styles.button} onPress={()=>this.login(this.state.email, this.state.password)}>
                    <Text style={styles.textButton}>Iniciar sesion</Text>    
                </TouchableOpacity>
                <Text style={styles.errorMessage}>{this.props.errorMessage}</Text>
                <TouchableOpacity onPress={ () => this.props.navigation.navigate('Registro')}>
                <Text style={styles.registro}>
                  ¿No tenés una cuenta? Registrate
              </Text>
                </TouchableOpacity>
            </View>
        )
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