import { GET_REGIONS, SET_REGIONS } from "../constants";

const regionsReducer = (state = [], action) => {
  if (action.type === GET_REGIONS) {
  }

  if (action.type === SET_REGIONS) {
    return action.payload;
  }
  return state;
};

export default regionsReducer;
