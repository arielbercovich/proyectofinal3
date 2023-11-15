import React, { Component } from 'react';
import {auth, db} from '../../firebase/config';
import {Text, View, FlatList, StyleSheet} from 'react-native'
import Post from '../../components/Post'

class Home extends Component{
    constructor(){
        super();
        this.state = {
            posts:[]
        }
    }

    componentDidMount(){
        db.collection('posts').orderBy('createdAt', 'desc').onSnapshot(
            docs => {
                let posts = [];
                docs.forEach( doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                    this.setState({
                        posts: posts
                    })
                }) 
            }
        )
    }


    render(){
        return(
            <>
                <Text style={styles.text}> HOME </Text>
                <FlatList 
                    data={this.state.posts}
                    keyExtractor={ onePost => onePost.id.toString()}
                    renderItem={ ({item}) => <Post postData={item} navigation={this.props.navigation}/>}
                />  
            </>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto, sans-serif', // Cambiado a una fuente más moderna
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        backgroundColor: '#007BFF', // Cambiado a un tono de azul vibrante
        marginBottom: 15,
        marginTop: 15,
        paddingVertical: 15, // Agregado espacio interno para mejorar la apariencia
        borderRadius: 10, // Bordes redondeados para un aspecto más suave
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

export default Home;

    
