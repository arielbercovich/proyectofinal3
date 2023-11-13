import {Text, View, FlatList, TouchableOpacity, StyleSheet} from "react-native"
import React, {Component} from 'react'
import Post from "../../components/Post"
import { db } from "../../firebase/config"
import firebase from "firebase"
import TouchHistoryMath from "react-native/Libraries/Interaction/TouchHistoryMath"
import { TextInput } from "react-native-web"
import FormComentarios from "../../components/FormComentarios"

class Comments extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.route.params.postId,  // Cambio aquí
            data: '',
            comentario: ''
        };
    }

    componentDidMount() {
        db.collection('posts').doc(this.state.id).onSnapshot(doc => {
            this.setState({ data: doc.data() });
        });
    }

    subirComentario(comentario) {
        db.collection('posts').doc(this.state.id).update({
            comentario: firebase.firestore.FieldValue.arrayUnion({
                owner: auth.currentUser.email,
                createdAt: Date.now(),
                comentario: comentario
            })
        })
        .then(() => {
            this.props.route.params.agregarComment({
                owner: auth.currentUser.email,
                createdAt: Date.now(),
                comentario: this.state.comentario
            });
            this.setState({
                comentario: ''
            });
        });
    }

    render() {
        return (
            <View style={styles.scroll}>
                <Text style={styles.text}>Comentarios del posteo</Text>
                {this.state.data.comentario == undefined ? (
                    <Text></Text>
                ) : this.state.data.comentario.length === 0 ? (
                    <Text style={styles.text2}>No hay comentarios, sé el primero</Text>
                ) : (
                    <View style={styles.scroll}>
                        <FlatList
                            data={this.state.data.comentario.sort((a, b) => b.createdAt - a.createdAt)}
                            keyExtractor={oneComment => oneComment.createdAt.toString()}
                            renderItem={({ item }) => (
                                <Text style={styles.textComent}>{item.owner} comentó: {item.comentario}</Text>
                            )}
                        />
                    </View>
                )}

                <FormComentarios></FormComentarios> 
                )
            </View>
        );
    }
}
const styles= StyleSheet.create({
    input:{
        height: 32,
        color:'white',
        backgroundColor: '#D3B9AA',
        fontFamily: 'Oswald, sans-serif',
        fontWeight:'bold',
        fontSize: 20,
        marginTop: 20,
    },

    text:{
        fontFamily: 'Oswald, sans-serif',
        color:'white',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign:'center',
        backgroundColor:'#926F5B',
        marginBottom: 30,
    },

    text2:{
        color:'#926F5B',
        marginTop: 5,
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10, 
        fontWeight: 'bold',  
    },

    subir:{
        color:'#926F5B',
        marginTop: 5,
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 19,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 10, 
        fontWeight: 'bold',  
    },

    textComent:{
        color:'#926F5B',
        marginTop: 5,
        fontFamily: 'Raleway, sans-serif;',
        fontSize:16,
        marginLeft:'0',
        marginBottom: 10,   
    },

    scroll:{
        flex: 1
    },

})

export default Comments;
