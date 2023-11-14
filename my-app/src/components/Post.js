import React, { Component } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { db, auth } from '../firebase/config';
import firebase from 'firebase';
import { AntDesign } from "@expo/vector-icons"

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            like: false,
            cantidadDeLikes: 0,
            showCamera: true,
            arrayComentarios: [],
            showModal: false,
            comentario: '', // Nuevo estado para almacenar el comentario
        };
    }

    componentDidMount() {
        const { infoPost, id } = this.props;
        if (infoPost) {
            this.props.infoPost && this.props.infoPost.datos && this.props.infoPost.datos.likes && this.props.infoPost.datos.likes.length > 0
                ? this.setState({
                    like: this.props.infoPost.datos.likes.includes(auth.currentUser.email),
                    cantidadDeLikes: this.props.infoPost.datos.likes.length
                })
                : null;

            this.getComentarios(this.props.infoid);
        }
    }

    getComentarios(postId) {
        db.collection('posts').doc(postId).get()
            .then(doc => {
                if (doc.exists) {
                    this.setState({
                        arrayComentarios: doc.data().comentarios || []
                    });
                }
            })
            .catch(error => console.log(error));
    }

    likear() {
        const { infoPost } = this.props;
    
        if (infoPost && infoPost.id) {
            db.collection('posts').doc(infoPost.id).update({
                likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)
            })
                .then(res => {
                    console.log(infoPost);
                    this.setState({
                        like: true,
                        cantidadDeLikes: this.state.cantidadDeLikes + 1
                    });
                })
                .catch(e => console.log(e));
        } else {
            console.log('Invalid infoPost data or missing document ID');
        }
    }
    
    unLike() {
        const { infoPost } = this.props;
    
        if (infoPost && infoPost.id) {
            db.collection('posts').doc(infoPost.id).update({
                likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
            })
                .then(res => {
                    this.setState({
                        like: false,
                        cantidadDeLikes: this.state.cantidadDeLikes - 1
                    });
                })
                .catch(e => console.log(e));
        } else {
            console.log('Invalid infoPost data or missing document ID');
        }
    }
    

    deletePost() {
        db.collection("posts")
            .doc(this.props.infoPost.id)
            .delete()
            .then(() => {
                console.log("Document successfully deleted!");
            });
    }

    showModal() {
        this.setState({
            showModal: true,
        });
    }

    closeModal() {
        this.setState({
            showModal: false,
        });
    }

    agregarComentario() {
        const { infoPost } = this.props;
        const { comentario } = this.state;
    
        if (infoPost && infoPost.id) {
            console.log('adding comment to post with id:', infoPost.id);
    
            if (comentario.trim() !== '') {
                db.collection('posts').doc(infoPost.id).update({
                    comentarios: firebase.firestore.FieldValue.arrayUnion({
                        usuario: auth.currentUser.email,
                        texto: comentario
                    })
                })
                .then(() => {
                    this.setState({
                        comentario: '' // Limpiar el campo de comentario después de agregarlo
                    });
                    this.getComentarios(infoPost.id); // Actualizar la lista de comentarios
                })
                .catch(e => console.log(e));
            }
        } else {
            console.log('Invalid infoPost data or missing document ID');
        }
    }
    

    render() {
        const { infoPost, navigation } = this.props;
        const { cantidadDeLikes, like, arrayComentarios, comentario } = this.state;

        console.log('infoPost:', infoPost);

        return (
            <View style={styles.container}>
                {infoPost ? (
                    <React.Fragment>
                        <Image
                            style={styles.foto}
                            source={{ uri: infoPost.fotoUrl || '' }}
                            resizeMode='cover'
                        />
                        <Text style={styles.ownerText}>Publicado por: {infoPost.owner}</Text>
                        <Text style={styles.postText}>{infoPost.textoPost}</Text>
                        <Text style={styles.likesText}>{cantidadDeLikes} Likes</Text>

                        {like ? (
                            <TouchableOpacity style={styles.likeButton} onPress={() => this.unLike()}>
                                <AntDesign name="heart" size={24} color="red" />
                                <Text style={styles.likeButtonText}> Quitar Like</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.likeButton} onPress={() => this.likear()}>
                                <AntDesign name="hearto" size={24} color="black" />
                                <Text style={styles.likeButtonText}> Like</Text>
                            </TouchableOpacity>
                        )}

                        {/* Agrega el TextInput para ingresar comentarios */}
                        <TextInput
                            style={styles.comentarioInput}
                            placeholder="Deja un comentario..."
                            value={comentario}
                            onChangeText={(text) => this.setState({ comentario: text })}
                        />

                        {/* Agrega el botón para agregar comentarios */}
                        <TouchableOpacity
                            style={styles.agregarComentarioButton}
                            onPress={() => this.agregarComentario()}
                        >
                            <Text style={styles.agregarComentarioButtonText}>Agregar Comentario</Text>
                        </TouchableOpacity>

                        {/* Lista de comentarios */}
                        <FlatList
                            data={arrayComentarios}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.comentarioContainer}>
                                    <Text style={styles.comentarioUsuario}>{item.usuario}:</Text>
                                    <Text style={styles.comentarioTexto}>{item.texto}</Text>
                                </View>
                            )}
                        />

                        <TouchableOpacity
                            style={styles.commentsButton}
                            onPress={() => navigation.navigate('Comentario', { postId: infoPost.id })}
                        >
                            <Text style={styles.commentsButtonText}>Ver Comentarios</Text>
                        </TouchableOpacity>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Text>Cargando...</Text>
                        <Text style={styles.errorText}>Error: No se encontraron datos del post.</Text>
                    </React.Fragment>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        elevation: 3,
    },
    foto: {
        height: 300,
        width: '100%',
        borderRadius: 8
    },
    ownerText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    postText: {
        fontSize: 14,
        marginBottom: 10,
    },
    likesText: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 10,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        borderWidth: 1,
        padding: 5,
        marginBottom: 10,
    },
    likeButtonText: {
        marginLeft: 5,
    },
    comentarioInput: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 8,
        marginBottom: 10,
    },
    agregarComentarioButton: {
        backgroundColor: 'lightblue',
        borderRadius: 5,
        padding: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    agregarComentarioButtonText: {
        color: 'black',
    },
    comentarioContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    comentarioUsuario: {
        fontWeight: 'bold',
        marginRight: 5,
    },
    comentarioTexto: {
        flex: 1,
    },
    commentsButton: {
        backgroundColor: 'lightgray',
        borderRadius: 5,
        padding: 10,
    },
    commentsButtonText: {
        textAlign: 'center',
        color: 'black',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 10,
    },
});

export default Post;


