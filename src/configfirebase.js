const admin = require("firebase-admin");
const firebase = require('firebase');

const serviceAccount = require("./parcial2web-a83c4-firebase-adminsdk-2tlvp-84fc0f8cf5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://parcial2web-a83c4.firebaseio.com",
  storageBucket: "parcial2web-a83c4.appspot.com"
});

const firebaseConfig = {
    apiKey: "AIzaSyCBLy1W3gAzd4XZd0K2Ksr-PVOl5zaqG2A",
    authDomain: "parcial2web-a83c4.firebaseapp.com",
    databaseURL: "https://parcial2web-a83c4.firebaseio.com",
    projectId: "parcial2web-a83c4",
    storageBucket: "parcial2web-a83c4.appspot.com",
    messagingSenderId: "812001430840",
    appId: "1:812001430840:web:501229dae3c1869e6bc5cd"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  module.exports = { admin, firebase };