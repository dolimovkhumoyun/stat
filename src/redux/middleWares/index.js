import io from "socket.io-client";
import { GET_REGIONS } from "../constants";
import { setRegions } from "../actions";

export const socket = io("101.4.0.254:8878/api");

export function regionsMiddleware({ dispatch }) {
  return function(next) {
    return function(action) {
      if (action.type === GET_REGIONS) {
        const token = localStorage.getItem("token");
        socket.emit("regions", { token });
        socket.once("regions", data => {
          dispatch(setRegions(data.data)); // passing list of regions to redux store
        });
      }
      return next(action);
    };
  };
}
