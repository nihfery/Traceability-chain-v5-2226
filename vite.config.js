import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import { createApiApp } from "./apiApp.js";

dotenv.config();

function localApiPlugin() {
  return {
    name: "local-api",
    configureServer(server) {
      const api = createApiApp();

      server.middlewares.use(api);
    },
  };
}

export default defineConfig({
  plugins: [localApiPlugin(), react(), tailwindcss()],
});
