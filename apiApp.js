import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.js";
import batchRoutes from "./routes/batches.js";
import systemRoutes from "./routes/system.js";

export function createApiApp({ enableCors = false } = {}) {
  const app = express();

  if (enableCors) {
    app.use(cors());
  }

  app.use(express.json({ limit: "5mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/system", systemRoutes);
  app.use("/api/batches", batchRoutes);

  app.use("/api", (req, res) => {
    res.status(404).json({ message: "API endpoint tidak ditemukan" });
  });

  return app;
}
