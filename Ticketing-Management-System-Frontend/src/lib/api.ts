"use client ";
import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// Request interceptor
api.interceptors.request.use(async (config) => {
  // Only run on client-side
  if (typeof window !== "undefined") {
    const { token } = parseCookies();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config.url.includes("/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      destroyCookie(null, "token");
      // Redirect to login if on client-side
      // if (typeof window !== "undefined") {
      //   window.location.href = "/login";
      // }
    }
    return Promise.reject(error);
  }
);

export default api;
