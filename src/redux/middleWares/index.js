import io from "socket.io-client";
import { GET_REGIONS, GET_POSTS } from "../constants";
import { setRegions, setPosts } from "../actions";

export const socket = io("101.4.0.254:8878/api");
const token = localStorage.getItem("token");

export function regionsMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      if (action.type === GET_REGIONS) {
        socket.emit("regions", { token });
        socket.once("regions", data => {
          dispatch(setRegions(data.data)); // passing list of regions to redux store
        });
        socket.on("err", data => {
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
        const regions = action.payload;
        socket.emit("posts", { regions, token });
        socket.once("posts", data => {
          dispatch(setPosts(data.data)); // passing list of posts to redux store
        });
        socket.on("err", data => {
          console.log(data);
        });
      }
      return next(action);
    };
  };
}
