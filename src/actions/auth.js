import { myFirebase, db } from "../firebase/firebase";
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

export const NOTES_REQUEST = "NOTES_REQUEST";
export const NOTES_SUCCESS = "NOTES_SUCCESS";

export const NOTE_ADD = "NOTE_ADD";
export const NOTE_EDIT = "NOTE_EDIT";

export const SAVE_NOTE_REQUEST = "SAVE_NOTE_REQUEST";
export const NOTE_DELETE = "NOTE_DELETE";
export const DELETE_CONFIRM = "DELETE_CONFIRM";

const requestLogin = () => {
  return {
    type: LOGIN_REQUEST
  };
};

const noteDelet = notes => {
  return {
    type: NOTE_DELETE,
    notes
  };
};

const deleteConfirm = () => {
  return {
    type: DELETE_CONFIRM
  };
};

const editNote = notes => {
  return {
    type: NOTE_EDIT,
    notes
  };
};

const newNote = notes => {
  return {
    type: NOTE_ADD,
    notes
  };
};

const recieveLogin = (user, notes) => {
  console.log("user: " + JSON.stringify(user));
  return {
    type: LOGIN_SUCCESS,
    user,
    notes
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

const RequestSaveNote = () => {
  return {
    type: SAVE_NOTE_REQUEST
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
      dispatch(getUserNotes(user));
      //dispatch(recieveLogin(user));
    }
    dispatch(verifySuccess());
  });
};

export const getUserNotes = user => dispatch => {
  //dispatch(requestNotes);
  let notes = [];
  const notesRef = db
    .collection("users")
    .doc(user.uid)
    .collection("notes");
  notesRef.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      var data = doc.data();
      notes.push({
        ID: doc.id,
        TITLE: data.title,
        BODY: data.body
      });
    });
    dispatch(recieveLogin(user, notes));
  });
};

export const saveNote = (uid, note, notes) => dispatch => {
  dispatch(RequestSaveNote());
  db.collection("users")
    .doc(uid)
    .collection("notes")
    .add({
      title: note.TITLE,
      body: note.BODY
    })
    .then(docRef => {
      note.ID = docRef.id;
      notes.push(note);
      dispatch(newNote(notes));
      console.log("Document written with ID: ", JSON.stringify(note));
    })
    .catch(error => {
      console.error("Error adding document: ", error);
    });
};

export const updateNote = data => dispatch => {
  const { uid, oldNotes, note } = data;
  dispatch(RequestSaveNote());
  db.collection("users")
    .doc(uid)
    .collection("notes")
    .doc(note.ID)
    .update({
      title: note.TITLE,
      body: note.BODY
    })
    .then(() => {
      const notes = updateArray(oldNotes, note);
      dispatch(editNote(notes));
      console.log("note updated");
    })
    .catch(error => {
      console.error("Error adding document: ", error);
    });
};

export const deletNote = data => dispatch => {
  const { uid, nid, oldNotes } = data;
  db.collection("users")
    .doc(uid)
    .collection("notes")
    .doc(nid)
    .delete()
    .then(() => {
      const notes = deleteArray(oldNotes, nid);
      console.log("NEW NOTES" + JSON.stringify(notes));
      dispatch(noteDelet(notes));
      dispatch(deleteConfirm());
    })
    .catch(function(error) {
      console.error("Error removing document: ", error);
    });
};

const deleteArray = (arr, id) => {
  return arr.filter(function(note) {
    return note.ID !== id;
  });
};

const updateArray = (arr, note) => {
  var index = arr.findIndex(x => x.ID === note.ID);

  arr[index] = note;

  return arr;
};
