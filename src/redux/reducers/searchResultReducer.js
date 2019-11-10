import {
  SET_FORM,
  GET_RESULT,
  SET_RESULT,
  SET_RESULT_COUNT,
  RESET_RESULTS
} from "../constants";
import _ from "lodash";

const searchResultReducer = (state = [], action) => {
  if (action.type === SET_FORM) {
    state.searchResult = [];
    state.searchResultCount = [];
    return {
      ...state,
      formData: action.payload
    }; // Saving the data from store to the store
  }
  if (action.type === RESET_RESULTS) {
    return [];
  }

  if (action.type === GET_RESULT) {
  }

  if (action.type === SET_RESULT) {
    let tmp = state.searchResult || [];
    let index = _.findIndex(tmp, ["id", action.payload.id]);
    if (index !== -1) {
      tmp[index] = action.payload;
    } else {
      tmp.push(action.payload);
    }
    return { ...state, searchResult: tmp };
  }

  if (action.type === SET_RESULT_COUNT) {
    let tmp = state.searchResultCount || [];
    let index = _.findIndex(tmp, ["id", action.payload.id]);
    if (index !== -1) {
      tmp[index] = action.payload;
    } else {
      tmp.push(action.payload);
    }

    return { ...state, searchResultCount: tmp };
  }

  return state;
};

export default searchResultReducer;
