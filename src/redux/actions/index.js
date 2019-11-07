import {
  GET_REGIONS,
  SET_REGIONS,
  GET_POSTS,
  SET_POSTS,
  SET_FORM,
  SET_RESULT,
  GET_RESULT
} from "../constants";

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

const setForm = data => ({
  type: SET_FORM,
  payload: data
});

const getResult = data => ({
  type: GET_RESULT,
  payload: data
});

const setResult = data => ({
  type: SET_RESULT,
  payload: data
});

export {
  getRegions,
  setRegions,
  getPosts,
  setPosts,
  setForm,
  getResult,
  setResult
};
