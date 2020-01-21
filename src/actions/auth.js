import { myFirebase, db, storage } from "../firebase/firebase";
import firebase from "firebase/app";

import { deleteArray, updateArray } from "../constants/helpers";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const GETTING_DATA = "GETTING_DATA";

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

export const FILES_DOWNLOADED = "FILES_DOWNLOADED";
export const UPLOADING_FILE = "UPLOADING_FILE";
export const FILE_UPLOADED = "FILE_UPLOADED";
export const PERCENT_UPLOAD = "PERCENT_UPLOAD";

const uploadingFile = type => {
  return {
    type: type
  };
};

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

const setFiles = files => {
  return {
    type: FILES_DOWNLOADED,
    files
  };
};

const updatePercent = percent => {
  return {
    type: PERCENT_UPLOAD,
    percent
  };
};
const getData = user => dispatch => {
  dispatch(getUserNotes(user));
};
export const loginUserEmail = (email, password) => dispatch => {
  dispatch(requestLogin());
  myFirebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      dispatch(getData(user));
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
      dispatch(getData(result.user));
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
      dispatch(getData(user));
    }
    dispatch(verifySuccess());
  });
};

export const getUserNotes = user => dispatch => {
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
        BODY: data.body,
        FILES: []
      });
    });

    dispatch(getFiles(notes, user.uid));
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
      body: note.BODY,
      files: []
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

export const uploadFile = data => dispatch => {
  dispatch(uploadingFile(UPLOADING_FILE));
  const { uid, nid, file, note, oldNotes } = data;
  var fileStorageRef = storage
    .ref()
    .child("users")
    .child(uid)
    .child(nid)
    .child(file.name);

  fileStorageRef.put(file).on(
    "state_changed",
    snapShot => {
      var progress = (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
      dispatch(updatePercent(progress));
      console.log("Upload is " + progress + "% done");
      console.log(snapShot.bytesTransferred);
    },
    error => {
      console.log("error: " + error);
    },
    () => {
      console.log("Uploaded File");
      fileStorageRef.getDownloadURL().then(url => {
        note.FILES.push(url);
        const notes = updateArray(oldNotes, note);
        dispatch(editNote(notes));
        dispatch(uploadingFile(FILE_UPLOADED));
      });
    }
  );
};

export const getFiles = (notes, uid) => dispatch => {
  notes.forEach(note => {
    var listRef = storage
      .ref()
      .child("users")
      .child(uid)
      .child(note.ID);
    listRef.listAll().then(res => {
      res.items.forEach(itemRef => {
        itemRef.getDownloadURL().then(url => {
          note.FILES.push(url);
        });
      });
    });
  });

  dispatch(setFiles(notes));
};
