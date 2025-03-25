// services/api.ts
import { getTokenAuth } from "@/utils/token.ts";
import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: "https://your-api.com/api",
  timeout: 10000,
});

// Attach JWT to every request if exists
api.interceptors.request.use(
  (config) => {
    const token = getTokenAuth();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handling without refresh-token logic
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const msg = error.response?.data?.message || "Something went wrong";

    if (status === 401) {
      toast.error("Unauthorized. Please login again.");
      // Optional: redirect to login page here if needed
    } else {
      toast.error(msg);
    }

    return Promise.reject(error);
  }
);
