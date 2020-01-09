import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API,
  authDomain: process.env.REACT_APP_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE,
  projectId: process.env.REACT_APP_PROJECT,
  storageBucket: process.env.REACT_APP_STORAGE,
  messagingSenderId: process.env.REACT_APP_SENDER,
  appId: process.env.REACT_APP_APP,
  measurementId: process.env.REACT_APP_MEASUREMENT
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDB = firebase.firestore();
export const db = baseDB;
