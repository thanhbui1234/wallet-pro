/* eslint-disable @typescript-eslint/no-explicit-any */

import { api } from "@/core/api.ts";

interface LoginResponse {
  token: string;
}

export const login = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  if (username === "chithanh" && password === "chithanh") {
    const token = "1232132132132131"; // Token giả định
    localStorage.setItem("token", token);
    return { token };
  } else {
    throw new Error("Invalid credentials");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export const loginService = async (username: string, password: string) => {
  try {
    // have not yet api
    // const response = await axiosInstance.post("/login", { email, password });
    if (username === "chithanh" && password === "chithanh") {
      const token = "1232132132132131"; // Token giả định
      const user = { "name ": "thanh" };
      return { token, user };
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const logoutService = async () => {
  return await api.post("/logout");
};
