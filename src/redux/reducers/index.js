import { combineReducers } from "redux";
import regionsReducer from "./regionsReducer";
import postsReducer from "./postsReducer";
import searchResultReducer from "./searchResultReducer";

const rootReducer = combineReducers({
  regions: regionsReducer,
  posts: postsReducer,
  results: searchResultReducer
});

export default rootReducer;
