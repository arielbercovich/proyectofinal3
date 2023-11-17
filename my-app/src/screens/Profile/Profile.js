import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, Modal, TextInput } from 'react-native';
import { auth, db } from '../../firebase/config';
import Post from '../../components/Post';
import Header from '../../components/Header';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      currentEmail: '',
      posts: [],
      modalVisible: false,
      pass: '',
      errors: '',
    };
  }

  componentDidMount() {
    const profileEmail = this.props.route.params.email;

    db.collection('posts')
      .where('owner', '==', profileEmail)
      .orderBy('createdAt', 'desc')
      .onSnapshot((docs) => {
        let posts = [];
        docs.forEach((doc) => {
          posts.push({
            id: doc.id,
            data: doc.data(),
          });
          this.setState({
            posts: posts,
          });
        });
      });

    db.collection('users')
      .where('owner', '==', profileEmail)
      .onSnapshot((docs) => {
        let user = [];
        docs.forEach((doc) => {
          user.push({
            id: doc.id,
            data: doc.data(),
          });
          this.setState({
            user: user,
          });
        });
      });
  }

  componentDidUpdate() {
    const profileEmail = this.props.route.params.email;

    if (this.state.currentEmail === profileEmail) return;

    this.setState({
      posts: [],
      user: [],
      currentEmail: profileEmail,
    });

    db.collection('posts')
      .where('owner', '==', profileEmail)
      .onSnapshot((docs) => {
        let posts = [];
        docs.forEach((doc) => {
          posts.push({
            id: doc.id,
            data: doc.data(),
          });
          this.setState({
            posts: posts,
            currentEmail: profileEmail,
          });
        });
      });

    db.collection('users')
      .where('owner', '==', profileEmail)
      .onSnapshot((docs) => {
        let user = [];
        docs.forEach((doc) => {
          user.push({
            id: doc.id,
            data: doc.data(),
          });
          this.setState({
            user: user,
            currentEmail: profileEmail,
          });
        });
      });
  }

  logOut() {
    auth
      .signOut()
      .then((res) => {
        this.props.navigation.navigate('Login');
      })
      .catch((error) => console.log('error'));
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

  render() {
    return (
      <View style={styles.container}>
        <Header title="PERFIL" onLogout={() => this.logout()} />
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalVisible: !this.state.modalVisible,
            });
          }}
        >
          <Text style={styles.textModal}>Confirme su contraseña</Text>
          <TextInput
            style={styles.inputModal}
            placeholder="Password"
            keyboardType="default"
            secureTextEntry={true}
            onChangeText={(text) => this.setState({ errors: '', pass: text })}
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

        {this.state.user.length === 0 ? (
          <Text> </Text>
        ) : (
            
          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.username}>Nombre de usuario: {this.state.user[0].data.username}</Text>
              <Text style={styles.email}>Email: {this.state.user[0].data.owner}</Text>
              <Text style={styles.bio}>Biografía: {this.state.user[0].data.bio}</Text>
            </View>
            <Image style={styles.profileImage} source={this.state.user[0].data.foto} resizeMode="cover" />
          </View>
        )}

        <Text style={styles.text2}> LISTA DE SUS {this.state.posts.length} POSTEOS </Text>
        <FlatList
          style={styles.posts}
          data={this.state.posts}
          keyExtractor={(onePost) => onePost.id.toString()}
          renderItem={({ item }) => <Post postData={item} navigation={this.props.navigation} />}
        />

        {this.state.user.length === 0 ? (
          <Text> </Text>
        ) : this.state.user[0].data.owner === auth.currentUser.email ? (
          <View>
            <TouchableOpacity style={styles.button} onPress={() => this.logOut()}>
              <Text style={styles.buttonText}>Cerrar sesión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({ modalVisible: !this.state.modalVisible })}
            >
              <Text style={styles.buttonText}>Borrar perfil</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text></Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },

  profileInfo: {
    flex: 1,
    marginRight: 10,
  },

  username: {
    fontFamily: 'italic',
    color: 'white',
    fontSize: 20,
    marginBottom: 5,
  },

  email: {
    fontFamily: 'italic',
    color: 'white',
    fontSize: 20,
    marginBottom: 5,
  },

  bio: {
    fontFamily: 'italic',
    color: 'white',
    fontSize: 20,
  },

  profileImage: {
    height: 75,
    width: 75,
    borderRadius: 50,
  },

  text2: {
    backgroundColor: 'white',
    color: 'black',
    fontFamily: 'italic',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  posts: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'White',
  },

  textModal: {
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: '40%',
    width: '100%',
    fontFamily: 'Oswald, sans-serif',
    borderRadius: 4,
    marginTop: 10,
  },

  inputModal: {
    color: '#4CAF50',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 4,
    fontFamily: 'Raleway, sans-serif',
    fontSize: 18,
    marginLeft: 0,
    fontStyle: 'italic',
  },

  notificacion: {
    color: '#4CAF50',
    marginTop: '15%',
    fontFamily: 'Raleway, sans-serif',
    fontSize: 20,
    marginLeft: '0',
  },
  posts: {
    textAlign: 'center',
    padding: 10,
    backgroundColor: 'White',
  },

  button: {
    backgroundColor: '#4CAF50',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    fontFamily: 'Raleway, sans-serif',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Profile;
