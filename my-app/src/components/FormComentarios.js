import React, {Component} from 'react'
import {Text,View,TextInput,TouchableOpacity,StyleSheet,Image,FlatList,} from "react-native";
import {db, auth} from "../firebase/config";
import firebase from 'firebase';

 class FormComentarios extends Component {
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
                style= {styles.input}
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
         borderColor:'gray'
     }
 })
export default FormComentarios