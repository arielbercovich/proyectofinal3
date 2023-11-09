import React, { Component } from 'react';
import {TextInput, TouchableOpacity, View, Text, StyleSheet, FlatList} from 'react-native';
import { db,auth } from '../firebase/config';
import firebase from 'firebase';
import MyCamera from './Camara/MyCamera'


class Post extends Component {
    constructor(props){
        super(props)
        this.state={
            like: false,
            cantidadDeLikes: this.props.infoPost.datos.likes.length,
            showCamera: true,

        }
    }
    
    componentDidMount(){
        //Indicar si el post ya está likeado o no.
        if(this.props.infoPost.datos.likes.includes(auth.currentUser.email)){
            this.setState({
                like: true
            })
        }
    }


   likear(){
    //El post tendría que guardar una propiedad like con un array de los usuario que lo likearon.

    //update en base de datos
    db.collection('posts').doc(this.props.infoPost.id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
    })
    .then( res => {
        this.setState({
            like: true,
            cantidadDeLikes: this.props.infoPost.datos.likes.length
        })
    })
    .catch( e => console.log(e))


   }

   unLike(){
    //Quitar del array de likes al usario que está mirando el post.
    db.collection('posts').doc(this.props.infoPost.id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
    })
    .then( res => {
        this.setState({
            like: false,
            cantidadDeLikes: this.props.infoPost.datos.likes.length
        })
    })
    .catch( e => console.log(e))
   }
   

   render(){
    return(
        <View>
                <Text>Datos del Post</Text>
                <Text> Email: {this.props.infoPost.datos.owner}</Text>
                <Text>Texto: {this.props.infoPost.datos.textoPost}</Text>
                <Text>cantidad de likes: {this.state.cantidadDeLikes}</Text>

                {/* If ternario */}
                {this.state.like ? 
                <TouchableOpacity onPress={()=>this.unLike()}>
                    QuitarLike
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={()=>this.likear()}>
                    Like
                </TouchableOpacity>
                }
                
                
            </View>
    )
}
}
const styles= StyleSheet.create ({

    posteo:{
        fontFamily: 'Oswald, sans-serif',
        color:'white',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign:'center',
        backgroundColor:'#926F5B',
        marginBottom: 70,
    },

    text:{
        color:'#926F5B',
        marginTop: 0,
        marginBottom: '10%',
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 25,
        marginLeft:'0',
        fontStyle: 'italic', 
        border: '2px solid #926F5B',
        borderRadius: 4 , 
        },
    
    input:{
        height: 32,
        color:'white',
        backgroundColor: '#D3B9AA',
        fontFamily: 'Oswald, sans-serif',
        fontWeight:'bold',
        fontSize: 25,
        textAlign: 'center',
        marginBottom: '10%',
    },
    
    title:{
        fontFamily: 'Oswald, sans-serif',
        color:'white',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign:'center',
        backgroundColor:'#926F5B',
        marginBottom: 15,
        marginTop:15
    }
})
export default Post;