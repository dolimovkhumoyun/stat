import io from "socket.io-client";
import { GET_REGIONS, GET_POSTS, SET_FORM } from "../constants";
import {
  setRegions,
  setPosts,
  setResult,
  setResultCount,
  resetResults
} from "../actions";

export const socket = io("101.4.0.254:8878/api");
// export const socket = io("192.168.1.8:8878/api");

export function regionsMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      if (action.type === GET_REGIONS) {
        const token = localStorage.getItem("token");
        socket.emit("regions", { token });
        socket.once("regions", data => {
          dispatch(setRegions(data.data)); // passing list of regions to redux store
        });
        socket.once("err", data => {
          console.log(data);
        });
      }
      return next(action);
    };
  };
}

export function postsMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      if (action.type === GET_POSTS) {
        const token = localStorage.getItem("token");
        const regions = action.payload;
        socket.emit("posts", { regions, token });
        socket.once("posts", data => {
          dispatch(setPosts(data.data)); // passing list of posts to redux store
        });
        socket.once("err", data => {
          console.log(data);
        });
      }
      return next(action);
    };
  };
}

export function searchResultMIddleware({ dispatch, getState }) {
  return function(next) {
    return function(action) {
      if (action.type === SET_FORM) {
        const token = localStorage.getItem("token");
        const formData = action.payload;
        dispatch(resetResults());
        socket.emit("search", { ...formData, token });
        socket.on("search", data => {
          dispatch(setResult(data));
        });
        socket.on("count", data => {
          dispatch(setResultCount(data));
        });
        socket.on("err", data => {
          console.log(data);
        });
      }
      return next(action);
    };
  };
}
