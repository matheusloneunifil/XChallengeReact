import { combineReducers } from "redux";
import appState from "./appState.reducer";

const rootReducers = combineReducers({
  appState,
});

export default rootReducers;
