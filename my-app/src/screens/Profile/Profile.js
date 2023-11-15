import {Text, FlatList, View, StyleSheet, Image, TouchableOpacity, Modal} from 'react-native'
import {auth, db} from '../../firebase/config'
import firebase from 'firebase'
import "firebase/auth";
import React, { Component } from 'react';
import Post from '../../components/Post'
import { TextInput } from 'react-native-web';

class Profile extends Component {
    constructor(props){
        super(props)
        this.state = {
            user:[],
            currentEmail: '',
            posts:[],
            modalVisible: false,
            pass: '',
            errors:''
        }
    }

    componentDidMount(){
        const profileEmail = this.props.route.params.email;

        db.collection('posts').where('owner', '==', profileEmail).orderBy('createdAt', 'desc').onSnapshot( 
            (docs) => {
                let posts = [];
                docs.forEach( (doc) => {
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
        db.collection('users').where('owner', '==', profileEmail).onSnapshot(
            (docs) => {
                let user = [];
                docs.forEach( (doc) => {
                    user.push({
                        id: doc.id,
                        data: doc.data()
                    })
                    this.setState({
                        user: user
                    })
                }) 
            }
        ) 
    }

    componentDidUpdate(){
        const profileEmail = this.props.route.params.email;

        if (this.state.currentEmail === profileEmail) return;
    
        this.setState({
            posts: [],
            user: [],
            currentEmail: profileEmail
        })

        db.collection('posts').where('owner', '==', profileEmail).onSnapshot( 
            docs => {
                let posts = [];
                docs.forEach( doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                    this.setState({
                        posts: posts,
                        currentEmail: profileEmail
                    })
                }) 
            }
        )
        db.collection('users').where('owner', '==', profileEmail).onSnapshot(
            docs => {
                let user = [];
                docs.forEach( doc => {
                    user.push({
                        id: doc.id,
                        data: doc.data()
                    })
                    this.setState({
                        user: user,
                        currentEmail: profileEmail
                    })
                }) 
            }
        ) 
    }
    
    logOut(){
        auth.signOut()
        .then((res) => {
            this.props.navigation.navigate('Login')
        })
        .catch((error) => console.log('error'))
    }

    eliminarPerfil(){
       if(this.state.user.length == 0){
           console.log('')
       } else {
        auth.signInWithEmailAndPassword(auth.currentUser.email, this.state.pass)
        .then(() => {
            db.collection('users')
            .doc(this.state.user[0].id) 
            .delete()
            .then(() => { 
                const user = firebase.auth().currentUser;
                user.delete()
                this.setState({
                    modalVisible: false
                })
                this.props.navigation.navigate('Register')
            })
            .catch(error => console.log(error))
        })
        .catch(error => this.setState({errors:error}))
        }
    }

    render(){
        return(
        <View style={styles.scroll}>
            <Text style={styles.perfil}> PERFIL </Text>
            <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({
                        modalVisible: !this.state.modalVisible
                    })
                }}>
                <Text style={styles.textModal}>Confirme su contraseña</Text>
                <TextInput  
                    style={styles.inputModal}
                    placeholder='Password'
                    keyboardType='default'
                    secureTextEntry= {true}
                    onChangeText={ text => this.setState({errors:'', pass: text}) }
                    value={this.state.pass}
                />  
                    
                { this.state.errors == '' ?
                    <TouchableOpacity  style={styles.text} onPress={() => this.eliminarPerfil()}>
                        <Text style={styles.logout}>Borrar perfil</Text>
                    </TouchableOpacity>
                    :
                    <Text style={styles.notificacion}>{this.state.errors.message}</Text>
                }

                <TouchableOpacity onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}>
                    <Text style={styles.logout}>Cancelar</Text>
                </TouchableOpacity>
            </Modal>

            { this.state.user.length == 0 ?
                <Text>  </Text> 
                :
                <View style={styles.container}>
                    <View style={styles.textContainer}> 
                        <Text style={styles.text}> Nombre de usuario: {this.state.user[0].data.userName} </Text> 
                        <Text style={styles.text}> Email: {this.state.user[0].data.owner} </Text> 
                        <Text style={styles.text}> Bibliografia: {this.state.user[0].data.bio} </Text> 
                    </View>
                    <Image
                        style={styles.foto}
                        source={this.state.user[0].data.foto}
                        resizeMode='cover'
                    /> 
                </View>
            }
            
            <Text style={styles.text2}> Lista de sus {this.state.posts.length} posteos  </Text>
            <FlatList
                style={styles.posts} 
                data={this.state.posts}
                keyExtractor={ onePost => onePost.id.toString()}
                renderItem={ ({item}) => <Post postData={item} navigation={this.props.navigation}  />}
            />    

            { this.state.user.length == 0 ?
                <Text>  </Text> 
                :
                this.state.user[0].data.owner == auth.currentUser.email ?
                <View>
                    <TouchableOpacity style={styles.text} onPress={()=> this.logOut()} >
                        <Text style={styles.logout}>Log out</Text>
                    </TouchableOpacity> 
                   
                    <TouchableOpacity style={styles.text} onPress={()=> this.setState({ modalVisible: !this.state.modalVisible })} >
                        <Text style={styles.logout} >Borrar perfil</Text>
                    </TouchableOpacity> 
                </View>
                :
                <Text></Text>
            }   
        </View>
        )
        
    }
}
const styles= StyleSheet.create ({
    scroll:{
        flex: 2
    },

    perfil:{
        fontFamily: 'Oswald, sans-serif',
        color:'white',
        fontWeight: 'bold',
        fontSize: 35,
        textAlign:'center',
        backgroundColor:'#926F5B',
        marginBottom: 15,
        marginTop:15
    },

    text:{
        fontFamily: 'Oswald, sans-serif',
        color:'white',
        fontSize: 20,
        flexDirection: 'column',
    },

    text2:{
        backgroundColor:'#D3B9AA',
        color: 'white',
        fontFamily: 'Raleway, sans-serif;',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',  
    },

    foto:{
        height:75,
        width:75,
        marginTop: 10,
        borderRadius:'50%',
        padding: 5,
    },

    container:{
        display: 'flex',
        flexDirection:'row',
        width: '100%',
        backgroundColor:'#926F5B',
    },

    textContainer:{
        flexDirection:'wrap',
        marginTop: 20,
    },

    logout:{
        backgroundColor: '#4CAF50',
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'Raleway, sans-serif;',
        fontSize:20,
        fontWeight: 'bold',
        color: 'white'
    },

    inputModal:{
        color:'#4CAF50',
        borderWidth: '2',
        borderColor: '4CAF50',
        borderRadius:4 ,
        fontFamily: 'Raleway, sans-serif;',
        fontSize:18,
        marginLeft:'0',
        fontStyle: 'italic', 
    },

    textModal:{
        color:'#4CAF50',
        fontSize:20,
        fontWeight: 'bold',
        marginRight:'40%',
        width:"100%",
        fontFamily: 'Oswald, sans-serif',
        borderRadius:4,
        marginTop: 10
    },

    notificacion:{
        color:'#4CAF50',
        marginTop: '15%',
        fontFamily: 'Raleway, sans-serif;',
        fontSize:20,
        marginLeft:'0',
    },
    posts: {
        textAlign:'center',
        padding:10,
        backgroundColor:'White'

    }
})

export default Profile