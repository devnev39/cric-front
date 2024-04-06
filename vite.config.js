import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: {
      "process.env.VITE_ENV": JSON.stringify(env.VITE_ENV),
      "process.env.VITE_ENKEY": JSON.stringify(env.VITE_ENKEY),
    },
    plugins: [react(), svgr()],
  };
});
