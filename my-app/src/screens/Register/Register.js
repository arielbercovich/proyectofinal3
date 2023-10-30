import react, {Component} from 'react';
import { auth } from '../../firebase/config';
import {TextInput, TouchableOpcaity, View, Text, StyleSheet} from 'react-native';

class Register extends Component{
    constructor(){
        super()
        this.state={
            email:'',
            username:'',
            password:''
        }
    }
    componentDidMount(){
        console.log("chequear que este logueado en firebase");
        auth.onAuthStateChanged(user => {
            console.log(user)
            if(user){
                this.props.navigation.navigate('home')
            }
        })
    }
    register(email,pass){
        auth.createUserWithEmailAndPassword(email,pass)
        .then(res => {
            console.log('se registro', res);

        })
        .catch(e => console.log(e))
    }
    render(){
        return(
            <View style={styles.formContainer}>
                <Text>Register</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({email: text})}
                    placeholder='email'
                    keyboardType='email-address'
                    value={this.state.email}
                    />
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({userName: text})}
                    placeholder='user name'
                    keyboardType='default'
                    value={this.state.userName}
                    />
                <TextInput
                    style={styles.input}
                    onChangeText={(text)=>this.setState({password: text})}
                    placeholder='password'
                    keyboardType='default'
                    secureTextEntry={true}
                    value={this.state.password}
                />
                <TouchableOpacity style={styles.button} onPress={()=>this.register(this.state.email, this.state.password)}>
                    <Text style={styles.textButton}>Registrarse</Text>    
                </TouchableOpacity>
                <TouchableOpacity onPress={ () => this.props.navigation.navigate('Login')}>
                   <Text>Ya tengo cuenta. Ir al login</Text>
                </TouchableOpacity>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    formContainer:{
        paddingHorizontal:10,
        marginTop: 20,
    },
    input:{
        height:20,
        paddingVertical:15,
        paddingHorizontal: 10,
        borderWidth:1,
        borderColor: '#ccc',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical:10,
    },
    button:{
        backgroundColor:'#28a745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius:4, 
        borderWidth:1,
        borderStyle: 'solid',
        borderColor: '#28a745'
    },
    textButton:{
        color: '#fff'
    }

})


export default Register;

