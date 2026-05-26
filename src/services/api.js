import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const token = sessionStorage.getItem("tealabs-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const language = localStorage.getItem("tealabs-language");
  if (language === "id" || language === "en") {
    config.headers["Accept-Language"] = language;
  }
  return config;
});

export default api;
