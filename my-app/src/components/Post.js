import React, {Component} from 'react'
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, Button, Alert} from 'react-native'
import {auth, db} from '../firebase/config'
import firebase from 'firebase'
import { FontAwesome } from '@expo/vector-icons';

class Post extends Component {
    constructor (props){
        super (props)
        this.state={
            cantidadLikes:this.props.postData.data.likes.length,
            miLike: false, 
            comentario: this.props.postData.data.comentario.sort((a,b)=> b.createdAt - a.createdAt),
        }
    }

    componentDidMount (){
        if(this.props.postData.data.likes.includes(auth.currentUser.email)){
            this.setState({
                miLike:true
            })
        }
    }

    like(){
        db.collection ('posts')
        .doc (this.props.postData.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayUnion (auth.currentUser.email)
        })
        .then(()=> this.setState({
            cantidadLikes: this.state.cantidadLikes + 1,
            miLike: true
        })
        )
        .catch(e=>console.log(e))
    }

    disLike(){
        db.collection ('posts')
        .doc (this.props.postData.id)
        .update({
            likes: firebase.firestore.FieldValue.arrayRemove (auth.currentUser.email)
        })
        .then(()=> this.setState({
            cantidadLikes: this.state.cantidadLikes - 1,
            miLike: false
        })
        )
        .catch(e=>console.log(e))
    }

    borrarPost(){
        db.collection('posts')
        .doc(this.props.postData.id)
        .delete() 
    }

    setComment(comment) {
        const newCommentsArr = this.state.comentario.concat([comment]);// comment es un objeto y lo concateno para que sea una posicion en el array de comentario 
        const sortedArr = newCommentsArr.sort((a,b)=> b.createdAt - a.createdAt);
        this.setState({
            comentario: sortedArr
        })
    }
    
    render(){
        return(
            <View style={styles.container}>
                <Image
                    style={styles.foto}
                    source={{uri: this.props.postData.data.foto}}
                    resizeMode='cover'
                    />

                <TouchableOpacity style={styles.text} onPress={()=> this.props.navigation.navigate('Perfil',{email:this.props.postData.data.owner}) }>
                    <Text  style={styles.text2}>Subido por {this.props.postData.data.owner} </Text>
                </TouchableOpacity>

                <Text style={styles.text} > {this.props.postData.data.textoPost}</Text>

                <View style={styles.view}>
                    { this.state.miLike ?
                    <TouchableOpacity style={styles.like} onPress={()=> this.disLike()} >
                        <FontAwesome name='heart' color='brown' size={28} />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.like} onPress={()=> this.like()} >
                        <FontAwesome name='heart-o' color='#926F5B' size={28} />
                    </TouchableOpacity>
                    } 
                    
                    <TouchableOpacity onPress={()=> this.props.navigation.navigate (
                        'Comments', {id:this.props.postData.id, agregarComment: comment => this.setComment(comment)})}> 
                        <FontAwesome name='comment-o' color='#926F5B' size={28} />
                    </TouchableOpacity>
                </View> 

                <Text style={styles.textLike}> {this.state.cantidadLikes} likes </Text>
            
                { this.state.comentario.length == 1 ?
                <Text style={styles.textComent3} > {this.state.comentario.length} comentario </Text> 
                :
                <Text style={styles.textComent3} > {this.state.comentario.length} comentarios </Text> 
                }

                <FlatList 
                    data={this.state.comentario.slice(0,4)} 
                    keyExtractor={ oneComent => oneComent.createdAt.toString()}
                    renderItem={ ({item}) => <Text style={styles.textComent}>{item.owner} comento: <Text style={styles.textComent2}> {item.comentario} </Text> </Text>}
                />  
            
                {
                    this.props.postData.data.owner == auth.currentUser.email ?
                    <TouchableOpacity style={styles.text} onPress={()=> this.borrarPost()} >
                        <Text style={styles.borrar}> Borrar este posteo</Text>
                    </TouchableOpacity>  
                    :
                    <Text></Text>
                }
            </View>
        )
    }
}

const styles= StyleSheet.create ({

    foto:{
        height:400,
        width:400,
        border: '2px solid #ddd',
        borderRadius:4 ,
        padding: 5,
        alignItems:'center'    
    },

    container:{
        backgroundColor: 'white',
        alignItems:'center', 
    },

    text:{
        marginTop: 0,
        fontFamily: 'Raleway, sans-serif;',
        fontSize:18,
        color:'#926F5B', 
        marginLeft:'0'   
    },

    text2:{
        color:'#926F5B',
        fontSize:20,
        fontWeight: 'bold',
        marginRight:'40%',
        width:"100%",
        fontFamily: 'Oswald, sans-serif',
        borderRadius:4
    },

    textComent:{
        color:'#926F5B',
        marginTop: 0,
        fontFamily: 'Raleway, sans-serif;',
        fontSize:16,
        marginLeft:'0',
        marginBottom: 15   
    },

    textComent2:{
        color:'#926F5B',
        marginTop: 0,
        fontStyle: 'italic',
        fontFamily: 'Raleway, sans-serif;',
        fontSize:16,
        marginLeft:'0'   
    },

    textComent3:{
        color:'brown',
        marginTop: 0,
        fontFamily: 'Raleway, sans-serif;',
        fontSize:18,
        marginLeft:'0' ,
        fontWeight: 'bold',  
        marginBottom: 10
    },

    like:{
        marginRight:'25%',
        marginTop: 2,
        marginLeft: '25%',
    },

    textLike:{
        color:'brown',
        marginTop: 0,
        fontFamily: 'Raleway, sans-serif;',
        fontSize:18,
        marginLeft:'0' ,
        fontWeight: 'bold',  
    },
    
    agregar:{
        color:'#946F5B',
        textDecorationLine: 'underline',
        marginTop: 0,
        fontFamily: 'Raleway, sans-serif;',
        fontSize:18,
        fontWeight: 'bold',  
        marginBottom:20
    },

    borrar:{
        marginBottom: 20,
        backgroundColor: '#946F5B',
        fontFamily: 'Raleway, sans-serif;',
        fontSize:18,
        color: 'white'
    },

    view:{
        display: 'flex',
        flexDirection: 'row',
        marginRight: '8%'
    }
})

export default Post;