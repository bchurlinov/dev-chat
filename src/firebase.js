import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCcr13AZkolsXAV96UM1XRIy4w1wB7kIq0",
    authDomain: "bojan-b3887.firebaseapp.com",
    databaseURL: "https://bojan-b3887.firebaseio.com",
    projectId: "bojan-b3887",
    storageBucket: "bojan-b3887.appspot.com",
    messagingSenderId: "112203988888",
    appId: "1:112203988888:web:5ceadf01c7b3d93c3a75ed"
};

firebase.initializeApp(firebaseConfig);

export default firebase;