import app from "firebase/app";
import firebase from 'firebase';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2yFMakJn_OnqLBopteYAptEQDIzziK54",
    authDomain: "proyectofinal3-5f49b.firebaseapp.com",
    projectId: "proyectofinal3-5f49b",
    storageBucket: "proyectofinal3-5f49b.appspot.com",
    messagingSenderId: "891557105361",
    appId: "1:891557105361:web:b212af1a1adf0eb0aa7ff0"
};

// Initialize Firebase
app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();