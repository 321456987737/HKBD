// lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Automatically prefixes all your requests with /api
});

// Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
