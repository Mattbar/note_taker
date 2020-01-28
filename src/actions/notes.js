import { db } from "../firebase/firebase";

import { deleteArray, updateArray } from "../constants/helpers";
//import { getFiles } from "./files";

export const NOTES_REQUEST = "NOTES_REQUEST";
export const NOTES_SUCCESS = "NOTES_SUCCESS";
export const NOTE_ADD = "NOTE_ADD";
export const NOTE_EDIT = "NOTE_EDIT";
export const SAVE_NOTE_REQUEST = "SAVE_NOTE_REQUEST";
export const NOTE_DELETE = "NOTE_DELETE";
export const DELETE_CONFIRM = "DELETE_CONFIRM";

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

export const editNote = notes => {
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
const RequestSaveNote = () => {
  return {
    type: SAVE_NOTE_REQUEST
  };
};

const RequestGetNotes = () => {
  return {
    type: NOTES_REQUEST
  };
};

const updateNotes = notes => {
  return {
    type: NOTES_SUCCESS,
    notes
  };
};

export const getUserNotes = user => dispatch => {
  dispatch(RequestGetNotes());
  let notes = [];
  const notesRef = db
    .collection("users")
    .doc(user.uid)
    .collection("notes");
  notesRef.get().then(querySnapshot => {
    querySnapshot.forEach(doc => {
      var data = doc.data();
      notes.push({
        id: doc.id,
        title: data.title,
        body: data.body,
        files: data.files
      });
    });
    dispatch(updateNotes(notes));
    //dispatch(getFiles(notes, user.uid));
  });
};

export const saveNote = (uid, note, notes) => dispatch => {
  let notes = [];
  dispatch(RequestSaveNote());
  db.collection("users")
    .doc(uid)
    .collection("notes")
    .add({
      title: note.title,
      body: note.body,
      files: []
    })
    .then(docRef => {
      note.id = docRef.id;
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
    .doc(note.id)
    .update({
      title: note.title,
      body: note.body,
      files: note.files
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
      dispatch(noteDelet(notes));
      dispatch(deleteConfirm());
    })
    .catch(function(error) {
      console.error("Error removing document: ", error);
    });
};
