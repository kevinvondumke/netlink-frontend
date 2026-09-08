import axios from "axios";

const LOCAL_API = "http://localhost:4400";

const apiBase = import.meta.env.VITE_API_URL ?? LOCAL_API;

const api = axios.create({
  baseURL: apiBase,
  withCredentials: true, // AUTO COOKIEES!
});

export default api;
