import axios from "axios";

let backendApi = process.env.REACT_APP_BACKEND_API;

export const getPlaces = (guestId) => {
  return axios.get(`${backendApi}/places/${guestId}`);
};

export const setCheckin = (data) => {
  return axios.post(`${backendApi}/places`, data);
};
