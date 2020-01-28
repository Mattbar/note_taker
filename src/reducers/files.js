import {
  FILES_DOWNLOADED,
  UPLOADING_FILE,
  FILE_UPLOADED,
  PERCENT_UPLOAD
} from "../actions";

export default (
  state = {
    isGettingData: false,
    uploadPercent: 100
  },
  action
) => {
  switch (action.type) {
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
