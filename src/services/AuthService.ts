import { api } from "@/core/api.ts";

interface LoginResponse {
  token: string;
}

export const loginService = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { username, password });
  const { token } = response.data;
  if (token) {
    localStorage.setItem("token", token);
  }
  return response.data;
};

export const logoutService = async () => {
  try {
    await api.post("/logout");
    localStorage.removeItem("token");
  } catch (error) {
    console.log("Logout error:", error);
  }
};
