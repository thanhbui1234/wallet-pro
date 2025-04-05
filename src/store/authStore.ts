/* eslint-disable @typescript-eslint/no-explicit-any */
import { showCustomToast } from "@/components/ui/toats.tsx";
import { loginService, logoutService } from "@/services/AuthService.ts";
import { create } from "zustand";

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// Get token from localStorage when the app starts
const storedToken = localStorage.getItem("token");

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: storedToken,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response = await loginService(username, password);
      if (response) {
        showCustomToast({
          type: "success",
          message: "Login successfully",
        });
        const { token } = response;
        set({ token, loading: false });
        window.location.href = "/"; // Redirect after successful login
      }
    } catch (error: any) {
      set({ error: "Login failed", loading: false });
      showCustomToast({
        type: "error",
        message: error?.response?.data?.message || "Login failed",
      });
    }
  },

  logout: async () => {
    try {
      await logoutService();
      set({ user: null, token: null });
      window.location.href = "/login"; // Redirect after logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));
