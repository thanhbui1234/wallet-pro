import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    // Define env variables to be used in your application
    define: {
      "process.env": env,
    },
    // Optional: Add proxy configuration if needed for API calls
    server: {
      proxy: {
        "/mexc": {
          target: "https://contract.mexc.com",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/mexc/, ""),
        },
        "/api": {
          target: env.API_URL || "http://160.250.246.44:3001/api/v1/",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    }
  };
});
