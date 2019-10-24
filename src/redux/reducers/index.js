import { combineReducers } from "redux";
import regionsReducer from "./regionsReducer";

const rootReducer = combineReducers({ regions: regionsReducer });

export default rootReducer;
