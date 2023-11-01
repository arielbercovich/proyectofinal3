import react, {Component} from 'react';
import { db,auth } from '../../firebase/config';
import {TextInput, TouchableOpacity, View, Text, StyleSheet} from 'react-native';

class Register extends Component{
    constructor(){
        super()
        this.state={
            email:'',
            username:'',
            pass:'',
            bio:'',
            errors: null
            
        }
    }
    componentDidMount(){
        console.log("chequear que este logueado en firebase");
        auth.onAuthStateChanged(user => {
            console.log(user)
            if(user){
                this.props.navigation.navigate('Home')
            }
        })
    }
    register(email, pass, username, bio){
        auth.createUserWithEmailAndPassword(email, pass)
            .then( res => {
                db.collection('users').add({
                    owner: email,
                    username: username,
                    bio: bio,
                    createdAt: Date.now()
                })
                
                    this.props.navigation.navigate('Login')
                })
            .catch(error => {
                this.setState({ error: 'Este usuario ya fue registrado. Inicie sesión.' });
                console.log(error);
            });    
                
    }
    render(){
        return(
            <View style={styles.formContainer}>
                <Text>Register</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({email: text, errors:''})}
                    placeholder='email'
                    keyboardType='email-address'
                    value={this.state.email}
                    />
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({username: text, errors:''})}
                    placeholder='user name'
                    keyboardType='default'
                    value={this.state.username}
                    />
                <TextInput
                    style={styles.text}
                    onChangeText={(text)=>this.setState({bio: text, errors:''})}
                    placeholder='mini-bio'
                    keyboardType='default'
                    value={this.state.bio}
                    />
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({pass: text, errors:''})}
                    placeholder='password'
                    keyboardType='default'
                    secureTextEntry={true}
                    value={this.state.pass}
                />
                {
                    this.state.email == '' || this.state.pass == '' || this.state.username == ''   ?
                    <Text  style={styles.notificacion}> Completar los campos</Text> 
                    
                    :
                    
                    <TouchableOpacity onPress={()=>this.register(this.state.email, this.state.pass, this.state.username, this.state.bio)}>
                        <Text style={styles.input} > REGISTRARME </Text>
                    </TouchableOpacity>    
                     
                    }
                     {this.state.error && <Text style={styles.error}>{this.state.error}</Text>}
                    <Text>{this.state.errors.message}</Text>
                <TouchableOpacity onPress={ () => this.props.navigation.navigate('Login')}>
                   <Text>Ya tengo cuenta. Ir al login</Text>
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
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: "#fff",
      width: 300,
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

