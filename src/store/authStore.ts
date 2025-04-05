/* eslint-disable @typescript-eslint/no-explicit-any */
import { showCustomToast } from "@/components/ui/toats.tsx";
import { loginService, logoutService } from "@/services/AuthService.ts";
import { create } from "zustand";

// Add a navigation function type
type NavigateFunction = (path: string) => void;

interface AuthState {
  user: any | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  login: (
    username: string,
    password: string,
    navigate?: NavigateFunction
  ) => Promise<void>;
  logout: (navigate?: NavigateFunction) => void;
}

// Get token from localStorage when the app starts
const storedToken = localStorage.getItem("token");

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: storedToken,
  loading: false,
  error: null,

  login: async (username, password, navigate) => {
    set({ loading: true, error: null });
    try {
      const response = await loginService(username, password);
      console.log(response, "response");

      if (response) {
        // Extract accessToken from the nested data property
        const accessToken = response.accessToken;

        console.log(accessToken, "accessToken");
        // Store token in localStorage
        localStorage.setItem("token", accessToken);

        showCustomToast({
          type: "success",
          message: "Login successfully",
        });
        set({ accessToken, loading: false });

        // Use React Router's navigate function if provided, otherwise fallback to window.location
        if (navigate) {
          navigate("/");
        } else {
          window.location.href = "/";
        }
      }
    } catch (error: any) {
      set({ error: "Login failed", loading: false });
      showCustomToast({
        type: "error",
        message: error?.response?.data?.message || "Login failed",
      });
    }
  },

  logout: async (navigate) => {
    try {
      await logoutService();
      // Remove token from localStorage
      localStorage.removeItem("token");

      set({ user: null, accessToken: null });

      // Use React Router's navigate function if provided
      if (navigate) {
        navigate("/login");
      } else {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));
