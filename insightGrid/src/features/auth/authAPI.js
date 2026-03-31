import axios from "axios";

const baseURL = "http://127.0.0.1:8000";

export const loginAPI = (email, password) =>
  axios.post(`${baseURL}/api/auth/login/`, { email, password });

export const refreshTokenAPI = (refresh) =>
  axios.post(`${baseURL}/api/auth/refresh/`, { refresh });
