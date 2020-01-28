import {
  NOTES_REQUEST,
  NOTES_SUCCESS,
  SAVE_NOTE_REQUEST,
  NOTE_DELETE,
  DELETE_CONFIRM,
  NOTE_ADD,
  NOTE_EDIT
} from "../actions";

export default (
  state = {
    loadingNotes: false,
    deleted: false,
    notes: []
  },
  action
) => {
  switch (action.type) {
    case NOTES_REQUEST:
      return {
        ...state,
        loadingNotes: true
      };
    case NOTES_SUCCESS:
      return {
        ...state,
        loadingNotes: false,
        notes: action.notes
      };
    case SAVE_NOTE_REQUEST:
      return {
        ...state,
        loadingNotes: true
      };
    case NOTE_DELETE:
      return {
        ...state,
        deleted: true,
        notes: action.notes
      };
    case DELETE_CONFIRM:
      return {
        ...state,
        deleted: false
      };
    case NOTE_ADD:
      return {
        ...state,
        loadingNotes: false,
        notes: action.notes
      };
    case NOTE_EDIT:
      return {
        ...state,
        loadingNotes: false,
        notes: action.notes
      };
    default:
      return state;
  }
};
