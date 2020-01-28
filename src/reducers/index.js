import { combineReducers } from "redux";
import auth from "./auth";
import notes from "./notes";
import files from "./files";

export default combineReducers({ auth, notes, files });
