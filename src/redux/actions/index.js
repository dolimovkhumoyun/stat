import { GET_REGIONS, SET_REGIONS, GET_POSTS, SET_POSTS } from "../constants";

const getRegions = () => ({
  type: GET_REGIONS
});

const setRegions = data => ({
  type: SET_REGIONS,
  payload: data
});

const getPosts = data => ({
  type: GET_POSTS,
  payload: data
});

const setPosts = data => ({
  type: SET_POSTS,
  payload: data
});

export { getRegions, setRegions, getPosts, setPosts };
