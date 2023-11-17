import React, { Component } from 'react';
import {auth, db} from '../../firebase/config';
import {Text, View, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native'
import Post from '../../components/Post'
import Header from '../../components/Header'

class Home extends Component{
    constructor(){
        super();
        this.state = {
            posts:[],
            checkingSession: true,
        }
    }

    componentDidMount(){
        auth.onAuthStateChanged(user => {
            if(!user){
                this.props.navigation.navigate('Login');
            }else{
                this.setState({
                    checkingSession: false
                });
            }
        })
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
    logout(){
        auth.signOut();
         //Redirigir al usuario a la home del sitio.
        this.props.navigation.navigate('Login')
    }



    render(){
        return(
            <>
                <Header title="HOME" onLogout={() => this.logout()} />
                {
                    this.state.posts.length === 0
                    ?
                    <View style ={styles.loader}>
                        <ActivityIndicator size='large' color='blue'/>
                    </View>
                    :

                    <FlatList 
                    data={this.state.posts}
                    keyExtractor={ onePost => onePost.id.toString()}
                    renderItem={ ({item}) => <Post postData={item} navigation={this.props.navigation}/>}
                    /> 
                } 
            </>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Roboto, sans-serif', 
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign: 'center',
        backgroundColor: '#007BFF', 
        marginBottom: 15,
        marginTop: 15,
        paddingVertical: 15, 
        borderRadius: 10, 
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 15,
            backgroundColor: '#3498db',
          },
          title: {
            fontSize: 24,
            color: 'white',
            fontWeight: 'bold',
          },
          logoutButton: {
            backgroundColor: '#e74c3c',
            padding: 10,
            borderRadius: 5,
          },
          logoutButtonText: {
            color: 'white',
            fontWeight: 'bold',
          },
          text: {
            color: 'black',
            marginTop: 55,
            marginBottom: 15,
            fontSize: 16,
            fontStyle: 'italic',
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 5,
            padding: 5,
            textAlign: 'center',
          },
          logoutButton: {
            backgroundColor: '#e74c3c',
            padding: 10,
            borderRadius: 5,
          },
          logoutButtonText: {
            color: 'white',
            fontWeight: 'bold',
          },
          loader:{
            justifyContent: 'center',
            alignItems: 'center'
          }
    },
});

export default Home;

    
