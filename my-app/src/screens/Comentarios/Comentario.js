import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { db, auth } from '../../firebase/config';
import firebase from 'firebase';
import Header from '../../components/Header';

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.route.params.id,
      data: '',
      comentario: '',
    };
  }

  componentDidMount() {
    db.collection('posts')
      .doc(this.state.id)
      .onSnapshot((doc) => {
        this.setState({
          data: doc.data(),
        });
      });
  }

  subirComentario(comentario) {
    db.collection('posts')
      .doc(this.state.id)
      .update({
        comentario: firebase.firestore.FieldValue.arrayUnion({
          owner: auth.currentUser.email,
          createdAt: Date.now(),
          comentario: comentario,
        }),
      })
      .then(() => {
        this.props.route.params.agregarComment({
          owner: auth.currentUser.email,
          createdAt: Date.now(),
          comentario: this.state.comentario,
        });
        this.setState({
          comentario: '',
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="COMENTÁ EL POSTEO" onLogout={() => this.logout()} />

        {this.state.data.comentario == undefined ? (
          <Text> </Text>
        ) : this.state.data.comentario.length == 0 ? (
          <Text style={styles.text2}> No hay comentarios, sé el primero en comentar </Text>
        ) : (
          <FlatList
            style={styles.commentList}
            data={this.state.data.comentario.sort((a, b) => b.createdAt - a.createdAt)}
            keyExtractor={(oneComment) => oneComment.createdAt.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentOwner}>{item.owner}</Text>
                <Text style={styles.commentText}>{item.comentario}</Text>
              </View>
            )}
          />
        )}

        <TextInput
          placeholder="Escriba aquí para comentar..."
          style={styles.input}
          keyboardType="default"
          onChangeText={(text) => this.setState({ comentario: text })}
          value={this.state.comentario}
        />

        {this.state.comentario == '' ? (
          <TouchableOpacity disabled style={styles.disabledButton}>
            <Text style={styles.disabledButtonText}>No hay ningún comentario para subir</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => this.subirComentario(this.state.comentario)}>
            <Text style={styles.subir}>Enviar comentario</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
  },

  text2: {
    color: '#555',
    marginTop: 5,
    fontFamily: 'italic',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },

  input: {
    height: 32,
    color: '#333',
    backgroundColor: '#F4F4F4',
    fontFamily: 'italic',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007BFF',
  },

  subir: {
    color: '#fff',
    backgroundColor: '#007BFF',
    marginTop: 10,
    paddingVertical: 10,
    textAlign: 'center',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },

  disabledButton: {
    backgroundColor: '#ddd',
    marginTop: 10,
    paddingVertical: 10,
    textAlign: 'center',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },

  disabledButtonText: {
    color: '#777',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },

  commentList: {
    marginTop: 10,
  },

  commentContainer: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  commentOwner: {
    fontFamily: 'italic',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  commentText: {
    fontFamily: 'italic',
    fontSize: 16,
  },
});

export default Comments;

