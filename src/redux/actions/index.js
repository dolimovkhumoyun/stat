import { GET_REGIONS, SET_REGIONS } from "../constants";

const getRegions = () => ({
  type: GET_REGIONS
});

const setRegions = data => ({
  type: SET_REGIONS,
  payload: data
});

export { getRegions, setRegions };
