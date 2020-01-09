import { applyMiddleware, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

import { verifyAuth } from "./actions";
import rootReducer from "./reducers";

export default function configStore(state) {
  const store = createStore(
    rootReducer,
    state,
    applyMiddleware(thunkMiddleware)
  );
  store.dispatch(verifyAuth());
  return store;
}
