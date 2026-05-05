import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_DEV_API_PROXY ?? "http://localhost:8000";

  return {
    server: {
      host: "::",
      port: 5173,
      // На локалке фронт ходит на /api — прокидываем на Django dev-сервер.
      proxy: {
        "/api": { target: proxyTarget, changeOrigin: true },
        "/admin": { target: proxyTarget, changeOrigin: true },
        "/static": { target: proxyTarget, changeOrigin: true },
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: "dist",
      sourcemap: false,
    },
  };
});
