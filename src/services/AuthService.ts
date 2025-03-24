// services/authService.ts
import { api } from "@/core/api.ts";
import { removeToken, setToken } from "@/utils/token.ts";

export const authService = {
  login: async (data: { email: string; password: string }) => {
    const res = await api.post("/auth/login", data);
    const { token } = res.data;
    setToken(token);
    return res.data;
  },

  logout: () => {
    removeToken();
  },
};
