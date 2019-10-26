import { combineReducers } from "redux";
import regionsReducer from "./regionsReducer";
import postsReducer from "./postsReducer";

const rootReducer = combineReducers({
  regions: regionsReducer,
  posts: postsReducer
});

export default rootReducer;
