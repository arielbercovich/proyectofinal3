import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native';
import { auth, db } from '../firebase/config';
import firebase from 'firebase';
import { FontAwesome } from '@expo/vector-icons';

class Post extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cantidadLikes: this.props.postData.data.likes.length,
      miLike: false,
      comentario: this.props.postData.data.comentario.sort((a, b) => b.createdAt - a.createdAt),
      
    };
  }

  componentDidMount() {
    if (this.props.postData.data.likes.includes(auth.currentUser.email)) {
      this.setState({
        miLike: true,
      });
    }
  }

  like() {
    db.collection('posts')
      .doc(this.props.postData.id)
      .update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email),
      })
      .then(() =>
        this.setState({
          cantidadLikes: this.state.cantidadLikes + 1,
          miLike: true,
        })
      )
      .catch((e) => console.log(e));
  }

  disLike() {
    db.collection('posts')
      .doc(this.props.postData.id)
      .update({
        likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email),
      })
      .then(() =>
        this.setState({
          cantidadLikes: this.state.cantidadLikes - 1,
          miLike: false,
        })
      )
      .catch((e) => console.log(e));
  }

  borrarPost() {
    db.collection('posts').doc(this.props.postData.id).delete();
  }

  setComment(comment) {
    const newCommentsArr = this.state.comentario.concat([comment]);
    const sortedArr = newCommentsArr.sort((a, b) => b.createdAt - a.createdAt);
    this.setState({
      comentario: sortedArr,
    });
  }
  

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.foto} source={{ uri: this.props.postData.data.foto }} resizeMode="cover" />

        <TouchableOpacity
          style={styles.text}
          onPress={() => this.props.navigation.navigate('Perfil', { email: this.props.postData.data.owner })}
        >
          <Text style={styles.text2}>Subido por {this.props.postData.data.owner}</Text>
        </TouchableOpacity>

        <Text style={styles.text}>{this.props.postData.data.textoPost}</Text>

        <View style={styles.iconContainer}>
          

          
        </View>

        <Text style={styles.textLike}>{this.state.miLike ? (
            <TouchableOpacity style={styles.icon} onPress={() => this.disLike()}>
              <FontAwesome name="heart" color="red" size={28} />
            </TouchableOpacity>
            
          ) : (
            <TouchableOpacity style={styles.icon} onPress={() => this.like()}>
              <FontAwesome name="heart-o" color="black" size={28} />
            </TouchableOpacity>
          )} {this.state.cantidadLikes} likes</Text>

        {this.state.comentario.length === 1 ? (
          <Text style={styles.textComent3}><TouchableOpacity
          style={styles.icon}
          onPress={() =>
            this.props.navigation.navigate('Comentario', {
              id: this.props.postData.id,
              agregarComment: (comment) => this.setComment(comment),
            })
          }
        >
          <FontAwesome name="comment-o" color="black" size={28} />
        </TouchableOpacity> {this.state.comentario.length} comentario</Text>
        ) : (
          <Text style={styles.textComent3}><TouchableOpacity
          style={styles.icon}
          onPress={() =>
            this.props.navigation.navigate('Comentario', {
              id: this.props.postData.id,
              agregarComment: (comment) => this.setComment(comment),
            })
          }
        >
          <FontAwesome name="comment-o" color="black" size={28} />
        </TouchableOpacity> {this.state.comentario.length} comentarios</Text>
        )}

        <FlatList
          data={this.state.comentario.slice(0, 4)}
          keyExtractor={(oneComent) => oneComent.createdAt.toString()}
          renderItem={({ item }) => (
            <Text style={styles.textComent}>
              {item.owner} comentó: <Text style={styles.textComent2}> {item.comentario} </Text>
            </Text>
          )}
        />

        {this.props.postData.data.owner === auth.currentUser.email ? (
          <TouchableOpacity style={styles.text} onPress={() => this.borrarPost()}>
            <Text style={styles.borrar}> Borrar este posteo 🗑️</Text>
          </TouchableOpacity>
        ) : (
          <Text></Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      marginVertical: 10,
      borderRadius: 10,
      padding: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    foto: {
      height: 400,
      width: '100%',
      borderRadius: 10,
    },
    text: {
      marginTop: 10,
      fontSize: 18,
      color: 'black',
      fontFamily: 'italic',
    },
    text2: {
      color: 'black',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      width: '100%',
      fontFamily: 'italic',
    },
    textComent: {
      color: 'black',
      fontSize: 16,
      marginBottom: 5,
      fontFamily: 'italic',
    },
    textComent2: {
      color: 'black',
      fontSize: 16,
      fontStyle: 'italic',
      fontFamily: 'italic',
    },
    textComent3: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      fontFamily: 'italic',
    },
    iconContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    icon: {
      marginHorizontal: 10,
    },
    textLike: {
      color: 'black',
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 5,
      fontFamily: 'Arial, sans-serif',
    },
    agregar: {
      color: 'black',
      textDecorationLine: 'underline',
      marginTop: 10,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      fontFamily: 'Arial, sans-serif',
    },
    borrar: {
      marginTop: 10,
      backgroundColor: 'red',
      fontSize: 18,
      color: 'white',
      padding: 8,
      borderRadius: 5,
      fontFamily: 'Arial, sans-serif',
    },
  });
  
  export default Post;