import {Text,View, TextInput, TouchableOpacity, StyleSheet} from 'react-native'
import React, {Component} from 'react'
import {db, auth} from "../firebase/config"
import firebase from 'firebase'

export default class FormComentarios extends Component {
    constructor(props){
        super(props)
        this.state ={
            comentario: '',
        }
    }
    enviarComentario(comentario){
        db.collection('posts').doc(this.props.postId).update({
            comentarios: firebase.firestore.FieldValue.arrayUnion({
                owner: auth.currentUser.email,
                createdAt: Date.now(),
                comenatrio:comentario
            })
        })
    }
    render(){
        return(
            <View>
                <TextInput
                placeholder='Agrega tu comentario'
                keyboardtype = 'default'
                onChangeText={(text)=> this.setState({comentario:text})}
                value={this.state.comentario}
                multiline ={true}
                numberOfLines ={4}
                style={Styles.input}
                />
                <TouchableOpacity
                onPress ={()=> this.enviarComentario(this.state.comentario)}>
                    <Text>Enviar</Text>
                </TouchableOpacity>

            </View>
        )
    }
}
const styles = StyleSheet.create({
    input:{
        borderWidth:1,
        borderColor:'green'
    }
})