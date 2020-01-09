import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import KEYS from "../keys/keys";

const firebaseConfig = {
  apiKey: KEYS.API,
  authDomain: KEYS.DOMAIN,
  databaseURL: KEYS.DATABASE,
  projectId: KEYS.PROJECT,
  storageBucket: KEYS.STORAGE,
  messagingSenderId: KEYS.SENDER,
  appId: KEYS.APP,
  measurementId: KEYS.MEASUREMENT
};

export const myFirebase = firebase.initializeApp(firebaseConfig);
const baseDB = firebase.firestore();
export const db = baseDB;
