/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { loginService } from "@/services/AuthService.ts";
import { create } from "zustand";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Lấy token từ localStorage khi app khởi động
const storedToken = localStorage.getItem("token");
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storedToken,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await loginService(email, password);
      if (response) {
        const { token, user } = response;
        localStorage.setItem("token", token);
        set({ user, token, loading: false });
      }
    } catch (error: any) {
      set({ error: "Login failed", loading: false });
    }
  },

  logout: async () => {
    // await logoutService();
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
