import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lorisparfume.uz";

export const axiosLoginInstance = axios.create({
  baseURL,
});

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
