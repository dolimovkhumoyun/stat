import { GET_POSTS, SET_POSTS } from "../constants";

const postsReducer = (state = [], action) => {
  if (action.type === GET_POSTS) {
  }
  if (action.type === SET_POSTS) {
    return action.payload;
  }
  return state;
};

export default postsReducer;
