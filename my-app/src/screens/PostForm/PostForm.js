import React, { Component } from 'react';
import { db, auth } from '../../firebase/config';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';
import MyCamera from '../../components/Camara/MyCamera';

class PostForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textoPost: '',
      likes: [],
      photo: null, // Agrega un estado para almacenar la foto capturada
      fotoUrl: '',
      loadingPhoto: false,
      showCamera: false,
    };
  }

  cambiarPosteoBoton(value) {
    this.setState({
      loadingPhoto: value,
    });
  }

  crearPost(owner, textoPost, fotoUrl, createdAt) {
    db.collection('posts')
      .add({
        owner: owner,
        textoPost: textoPost,
        fotoUrl: fotoUrl,
        likes: [],
        comentario: [],
        createdAt: createdAt,
      })
      .then((res) => {
        console.log(res);
        // Después de crear el post, redirigir a Home
        this.props.navigation.navigate('Home');
      })
      .catch((e) => console.log(e));
  }

  trearUrlDeFoto(url) {
    this.setState({
      fotoUrl: url,
    });
  }

  render() {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.title}>NUEVA PUBLICACIÓN EN rubober.com 📷</Text>

        {this.state.showCamera ? (
          <MyCamera
            style={styles.camera}
            cambiarPosteoBoton={(value) => this.cambiarPosteoBoton(value)}
            traerUrlDeFoto={(url) => this.trearUrlDeFoto(url)}
          />
        ) : null}

        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ textoPost: text })}
          placeholder='Escribí el texto de tu post...'
          keyboardType='default'
          value={this.state.textoPost}
        />

        {!this.state.showCamera && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ showCamera: true })}
          >
            <Text style={styles.textButton}>Sacar foto (¡Ponete fachero!)</Text>
          </TouchableOpacity>
        )}

        {this.state.loadingPhoto == false && this.state.showCamera && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                this.crearPost(auth.currentUser.email, this.state.textoPost, this.state.fotoUrl, Date.now());
                this.setState({ showCamera: false });
              }}
            >
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => this.setState({ showCamera: false })}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
    height: 200,
    aspectRatio: 1,
    marginBottom: 20,
  },
  input: {
    height: 100,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'solid',
    borderRadius: 6,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: 'center',
    borderRadius: 6,
    marginTop: 10,
  },
  textButton: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#2ecc71',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: 'center',
    borderRadius: 6,
    marginRight: 5,
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: 'center',
    borderRadius: 6,
    marginLeft: 5,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostForm;

