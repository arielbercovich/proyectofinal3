import { Text, View, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { Component } from 'react'
import {db, auth} from "../../firebase/config"
import firebase from 'firebase'
//import Post from '../../components/Post'
import TouchHistoryMath from 'react-native/Libraries/Interaction/TouchHistoryMath'

class Comments extends Component {
    constructor (props){
        super (props)
        this.state = {
            id:this.props.route.params.id,
            data:'',
            comentario:'',
        }
    }

    componentDidMount(){
        db.collection('posts')
        .doc(this.state.id)
        .onSnapshot(doc => {this.setState({
            data: doc.data(),   
        })
        })
    }

    subirComentario(comentario){
        db.collection('posts')
        .doc(this.state.id)
        .update({
            comentario: firebase.firestore.FieldValue.arrayUnion({ 
                owner:auth.currentUser.email,
                createdAt: Date.now(),
                comentario: comentario, 
            })  
        })
        .then(() => {
            this.props.route.params.agregarComment({
                owner:auth.currentUser.email,
                createdAt: Date.now(),
                comentario: this.state.comentario,
            })
            this.setState({
                comentario: '',     
            }) 
        })
    }

    render(){
        return (
            <View style={styles.scroll}>
                <Text style={styles.text}> Comentarios del posteo</Text>

                { this.state.data.comentario == undefined ?
                    <Text> </Text>
                    :
                    this.state.data.comentario.length == 0 ?
                    <Text style={styles.text2} > No hay comentarios, se el primero en comentar </Text> 
                    :
                    <View style={styles.scroll}> 
                        <FlatList 
                            data={this.state.data.comentario.sort((a,b)=> b.createdAt - a.createdAt)}
                            keyExtractor={ oneComent => oneComent.createdAt.toString()}
                            renderItem={ ({item}) => <Text style={styles.textComent}>{item.owner} comento: {item.comentario}</Text>}
                        /> 
                    </View> 
                }

                <TextInput 
                    placeholder='Escriba aquí para comentar'
                    style={styles.input}
                    keyboardType='default'
                    onChangeText={text=> this.setState({comentario:text})}
                    value={this.state.comentario}
                />

                { this.state.comentario == '' ?
                    <TouchableOpacity >
                        <Text style={styles.text2}> No hay ningún comentario para subir </Text>
                    </TouchableOpacity> 
                    :
                    <TouchableOpacity onPress={()=> this.subirComentario(this.state.comentario) }>
                        <Text style={styles.subir}>Subir comentario</Text>
                    </TouchableOpacity> 
                } 
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        height: 32,
        color: '#333',
        backgroundColor: '#F4F4F4',
        fontFamily: 'Roboto, sans-serif',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 20,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 2, // Añadido borde
        borderColor: '#007BFF', // Color del borde
    },

    text: {
        fontFamily: 'Roboto, sans-serif',
        color: '#333',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        backgroundColor: '#FFA500',
        marginBottom: 30,
        paddingVertical: 15,
        borderRadius: 10,
    },

    text2: {
        color: '#555',
        marginTop: 5,
        fontFamily: 'Roboto, sans-serif',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        fontWeight: 'bold',
    },

    subir: {
        color: '#fff',
        backgroundColor: '#007BFF',
        marginTop: 10,
        paddingVertical: 10,
        textAlign: 'center',
        borderRadius: 8,
        fontSize: 19,
        fontWeight: 'bold',
    },

    textComent: {
        color: '#555',
        marginTop: 5,
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        marginLeft: '0',
        marginBottom: 10,
    },

    scroll: {
        flex: 1,
    },

    commentFormContainer: {
        borderWidth: 2, 
        borderColor: '#007BFF', 
        borderRadius: 8,
        padding: 15,
        marginVertical: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

export default Comments;
