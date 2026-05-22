import dotenv from "dotenv";
import { spawn } from "child_process";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { createApiApp } from "./apiApp.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === "production" || process.argv.includes("--production");
const isApiOnly = process.argv.includes("--api-only");

const app = createApiApp({ enableCors: true });

async function useFrontend() {
  if (isApiOnly) {
    return;
  }

  if (isProduction) {
    const distPath = path.join(__dirname, "dist");
    const indexPath = path.join(distPath, "index.html");

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send("Frontend build tidak ditemukan. Jalankan npm run build dulu.");
      }

      return res.sendFile(indexPath);
    });
    return;
  }

  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    appType: "spa",
    server: {
      middlewareMode: true,
    },
  });

  app.use(vite.middlewares);
}

await useFrontend();

const requestedPort = Number(process.env.PORT) || 5000;
const fallbackAttempts = Number(process.env.PORT_FALLBACK_ATTEMPTS) || 10;

function openBrowser(url) {
  if (isProduction || isApiOnly || process.env.OPEN_BROWSER === "false") {
    return;
  }

  const command = process.platform === "win32" ? "cmd" : process.platform === "darwin" ? "open" : "xdg-open";
  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const browser = spawn(command, args, {
    detached: true,
    stdio: "ignore",
  });

  browser.unref();
}

function startServer(port, remainingAttempts) {
  const server = createServer(app);

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE" && remainingAttempts > 0) {
      const nextPort = port + 1;
      console.warn(`Port ${port} sedang dipakai, mencoba port ${nextPort}...`);
      startServer(nextPort, remainingAttempts - 1);
      return;
    }

    console.error(error);
    process.exit(1);
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`App running on ${url}`);
    openBrowser(url);
  });
}

startServer(requestedPort, fallbackAttempts);
