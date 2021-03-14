import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCgxGmG9OnQOt8bSoJSDCtgioeb8tZqVZo",
    authDomain: "ecommerce-store-10b27.firebaseapp.com",
    projectId: "ecommerce-store-10b27",
    storageBucket: "ecommerce-store-10b27.appspot.com",
    messagingSenderId: "648220768872",
    appId: "1:648220768872:web:63255a7fed730f060499dd"
};

const app = firebase.initializeApp(firebaseConfig);

export const db = app.firestore();
export const auth = firebase.auth();

export default app;