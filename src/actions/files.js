import { storage } from "../firebase/firebase";

import { updateArray } from "../constants/helpers";
import { editNote } from "./notes";

export const FILES_DOWNLOADED = "FILES_DOWNLOADED";
export const UPLOADING_FILE = "UPLOADING_FILE";
export const FILE_UPLOADED = "FILE_UPLOADED";
export const PERCENT_UPLOAD = "PERCENT_UPLOAD";

const uploadingFile = type => {
  return {
    type: type
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
    },
    error => {
      console.log("error: " + error);
    },
    () => {
      console.log("Uploaded File");
      fileStorageRef.getDownloadURL().then(url => {
        note.files.push(url);
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
      .child(note.id);
    listRef.listAll().then(res => {
      res.items.forEach(itemRef => {
        itemRef.getDownloadURL().then(url => {
          note.files.push(url);
        });
      });
    });
  });

  dispatch(setFiles(notes));
};
