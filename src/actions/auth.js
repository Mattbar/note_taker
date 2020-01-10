import { myFirebase } from "../firebase/firebase";
import firebase from "firebase/app";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const recieveLogin = user => {
  console.log("user: " + JSON.stringify(user));
  return {
    type: LOGIN_SUCCESS,
    user: user
  };
};

const loginError = () => {
  return {
    type: LOGIN_FAILURE
  };
};

const requestLogout = () => {
  return {
    type: LOGOUT_REQUEST
  };
};

const receiveLogout = () => {
  return {
    type: LOGOUT_SUCCESS
  };
};

const logoutError = () => {
  return {
    type: LOGOUT_FAILURE
  };
};

const verifyRequest = () => {
  return {
    type: VERIFY_REQUEST
  };
};

const verifySuccess = () => {
  return {
    type: VERIFY_SUCCESS
  };
};

const requesSignup = () => {
  return {
    type: SIGNUP_REQUEST
  };
};

const SignupError = () => {
  return {
    type: SIGNUP_FAILURE
  };
};

export const loginUserEmail = (email, password) => dispatch => {
  dispatch(requestLogin());
  myFirebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      dispatch(recieveLogin(user));
    })
    .catch(error => {
      // TODO HANDLE ERROR
      console.log("login error: " + error);
      dispatch(loginError());
    });
};

export const loginUserGoogle = () => dispatch => {
  dispatch(requestLogin());
  var provider = new firebase.auth.GoogleAuthProvider();

  myFirebase
    .auth()
    .signInWithPopup(provider)
    .then(function(result) {
      dispatch(recieveLogin(result.user));
    })
    .catch(error => {
      // TODO HANDLE ERROR
      console.log("login error: " + error);
      dispatch(loginError());
    });
};

export const signUpEmail = (email, password) => dispatch => {
  dispatch(requesSignup());
  myFirebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
      console.log("signup error: " + error.code);
      dispatch(SignupError());
    });
};

export const logoutUser = () => dispatch => {
  dispatch(requestLogout());
  myFirebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch(error => {
      // TODO HANDLE ERROR
      console.log("logout error: " + error);
      dispatch(logoutError());
    });
};

export const verifyAuth = () => dispatch => {
  dispatch(verifyRequest());
  myFirebase.auth().onAuthStateChanged(user => {
    if (user !== null) {
      dispatch(recieveLogin(user));
    }
    dispatch(verifySuccess());
  });
};
