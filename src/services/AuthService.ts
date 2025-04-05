import { api } from "@/core/api.ts";

interface LoginResponse {
  accessToken: string;
}

export const loginService = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", { username, password });
  return response.data;
};

export const logoutService = async () => {
  try {
    await api.post("/logout");
  } catch (error) {
    console.log("Logout error:", error);
  }
};
