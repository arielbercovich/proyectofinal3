import React, { Component } from 'react';
import { db, auth } from '../../firebase/config';
import { TextInput, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import MyCamera from '../../components/Camara/MyCamera'

class Register extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            username: '',
            pass: '',
            bio: '',
            error: null,
            showCamera: false,
            foto:''
        }
    }

    componentDidMount() {
        auth.onAuthStateChanged(user => {
            console.log(user)
            if (user) {
                this.props.navigation.navigate('Menu')
            }
        })
    }

    register(email, pass, username, bio, foto) {
        auth.createUserWithEmailAndPassword(email, pass)
            .then(res => {
                db.collection('users').add({
                    owner: email,
                    username: username,
                    bio: bio,
                    foto: foto,
                    createdAt: Date.now()
                })
                this.props.navigation.navigate('Login')
            })
            .catch(error => {
                this.setState({ error:error.message });
                console.log(error);
            });
    }
    onImageUpload(url){
        this.setState({
            foto:url,
            showCamera:false

        })

    }

    render() {
        return (
            <View style={styles.formContainer}>
                <Header title="FORMULARIO DE REGISTRO" showLogout={false} />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ email: text, error: '' })}
                    placeholder='Email *'
                    keyboardType='email-address'
                    value={this.state.email}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ username: text, error: '' })}
                    placeholder='Nombre de Usuario *'
                    keyboardType='default'
                    value={this.state.username}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ pass: text, error: '' })}
                    placeholder='Contraseña *'
                    keyboardType='default'
                    secureTextEntry={true}
                    value={this.state.pass}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.setState({ bio: text, error: '' })}
                    placeholder='Contanos algo de vos!'
                    keyboardType='default'
                    value={this.state.bio}
                />
                {this.state.showCamera?
                <View style={{width:'50vw',heigth:'50vh'}}>
                    <MyCamera onImageUpload={url => this.onImageUpload(url)}/>
                    </View>
                    :
                    <TouchableOpacity onPress={()=> this.setState({showCamera:true})}>
                        <Text style={styles.input}>Subir foto de perfil</Text>
                    </TouchableOpacity>
                }

                {this.state.email == '' || this.state.pass == '' || this.state.username == '' ?
                    <Text style={styles.notificacion}>* campo obligatorio</Text> 
                    :
                    <TouchableOpacity onPress={() => this.register(this.state.email, this.state.pass, this.state.username, this.state.bio, this.state.foto)}>
                        <Text style={styles.input}>REGISTRARME</Text>
                    </TouchableOpacity>}
                {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={styles.textButton}>Ya tengo cuenta. Ir al login</Text>
                </TouchableOpacity>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderColor: 'grey',
      borderStyle: 'solid',
      borderWidth: 1,
      marginLeft: 50,
      marginTop: 30,
      marginRight: 50,
      borderRadius: 20,
      minHeight: 'auto',
    },
  
  
    campos: {
      alignItems: "center", 
      marginBottom: 50,
      padding: 10,
    },
    notificacion:{
        color:'#926F5B',
        marginTop: '15%',
        fontFamily: 'Raleway, sans-serif;',
        fontSize:20,
        marginLeft:'0',
    },
  
    user: {
      fontSize: 100,
      textAlign: 'center',
      color: '#1b99e5',
    },
  
    button: {
        backgroundColor: "#405DE6",
        marginHorizontal: 10,
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: "center",
        borderRadius: 4,
        color: "#fff",
        marginTop: 20,
        fontFamily: 'Raleway, sans-serif',
      },
    
      textButton: {
        color: "#fff",
        textAlign: "center",
        fontFamily: 'Raleway, sans-serif',
      },
  
    input: {
      marginTop: 5,
      marginBottom: 5,
      borderColor: 'grey',
      borderStyle: 'solid',
      borderWidth: 1,
      width: 300,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 4,
    },
  
    recordar: {
      marginHorizontal: 10,
      marginTop: 5,
      marginBottom: 5,
    },
  
    record: {
      color: "#405DE6",
    },
  
    errorCode: {
      color: 'red',
    },
    
  });
  


export default Register;

