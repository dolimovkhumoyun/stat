import { SET_FORM, GET_RESULT, SET_RESULT } from "../constants";

const searchResultReducer = (state = [], action) => {
  if (action.type === SET_FORM) {
    return { ...state, formData: action.payload }; // Saving the data from store to the store
  }

  if (action.type === GET_RESULT) {
    //    re
  }

  if (action.type === SET_RESULT) {
  }

  return state;
};

export default searchResultReducer;
