import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE,
  VERIFY_REQUEST,
  VERIFY_SUCCESS,
  SIGNUP_REQUEST,
  SIGNUP_FAILURE,
  NOTES_REQUEST,
  NOTES_SUCCESS,
  SAVE_NOTE_REQUEST,
  NOTE_DELETE,
  DELETE_CONFIRM,
  NOTE_ADD,
  NOTE_EDIT,
  FILES_DOWNLOADED,
  UPLOADING_FILE,
  FILE_UPLOADED,
  PERCENT_UPLOAD
} from "../actions/";

export default (
  state = {
    isSigningup: false,
    isLoggingIn: false,
    isLoggingOut: false,
    isVerifying: false,
    verifyingError: false,
    loginError: false,
    logoutError: false,
    signupError: false,
    isAuthenticated: false,
    isGettingData: false,
    uploadPercent: 100,
    deleted: false,
    user: {},
    notes: []
  },
  action
) => {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return {
        ...state,
        isSigningup: true,
        signupError: false
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        isSigningup: false,
        isAuthenticated: false,
        signupError: true
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        isLoggingIn: true,
        isGettingData: true,
        loginError: false
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: true,
        isGettingData: false,
        user: action.user,
        notes: action.notes
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoggingIn: false,
        isAuthenticated: false,
        loginError: true
      };
    case LOGOUT_REQUEST:
      return {
        ...state,
        isLoggingOut: true,
        logoutError: false
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isLoggingOut: false,
        isAuthenticated: false,
        user: {}
      };
    case LOGOUT_FAILURE:
      return {
        ...state,
        isLoggingOut: false,
        logoutError: true
      };
    case VERIFY_REQUEST:
      return {
        ...state,
        isVerifying: true,
        verifyingError: false
      };
    case VERIFY_SUCCESS:
      return {
        ...state,
        isVerifying: false
      };
    case NOTES_REQUEST:
      return {
        ...state,
        isGettingData: true
      };
    case NOTES_SUCCESS:
      return {
        ...state,
        isGettingData: false,
        notes: action.notes
      };
    case SAVE_NOTE_REQUEST:
      return {
        ...state,
        isGettingData: true
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
        isGettingData: false,
        notes: action.notes
      };
    case NOTE_EDIT:
      return {
        ...state,
        isGettingData: false,
        notes: action.notes
      };
    case FILES_DOWNLOADED:
      return {
        ...state,
        notes: action.notes
      };
    case UPLOADING_FILE:
      return {
        ...state,
        isGettingData: true,
        uploadPercent: 0
      };
    case FILE_UPLOADED:
      return {
        ...state,
        isGettingData: false,
        uploadPercent: 100
      };
    case PERCENT_UPLOAD:
      return {
        ...state,
        uploadPercent: action.percent
      };
    default:
      return state;
  }
};
