import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducers/index";
import thunk from "redux-thunk";
import {
  regionsMiddleware,
  postsMiddleware,
  searchResultMIddleware
} from "../middleWares";

const storeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  storeEnhancers(
    applyMiddleware(
      thunk,
      regionsMiddleware,
      postsMiddleware,
      searchResultMIddleware
    )
  )
);

export default store;
