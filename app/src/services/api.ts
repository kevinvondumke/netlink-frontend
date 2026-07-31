import axios from "axios";

const LOCAL_API = "http://localhost:4400";

const apiBase = import.meta.env.VITE_API_URL ?? LOCAL_API;

const api = axios.create({
  baseURL: apiBase,
});

// INJECT TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
