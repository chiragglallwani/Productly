import firebase from "firebase";
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,//"productly-80dfc.firebaseapp.com",//process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

//var provider = new firebase.auth.GoogleAuthProvider();
const emailAndPassword = new firebase.auth.EmailAuthProvider();
const googleAuth = new firebase.auth.GoogleAuthProvider();
const facebookAuth = new firebase.auth.FacebookAuthProvider();
const appleAuth = new firebase.auth.OAuthProvider('apple.com');
const auth = firebaseApp.auth();
const db = firebase.firestore();

export {db, emailAndPassword, googleAuth, facebookAuth, appleAuth, auth};
