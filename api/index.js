import dotenv from "dotenv";
import { createApiApp } from "../apiApp.js";

dotenv.config();

const app = createApiApp({ enableCors: true });

function readRewritePath(req, url) {
  const queryPath = req.query?.path;
  if (Array.isArray(queryPath)) {
    return queryPath.join("/");
  }

  return queryPath || url.searchParams.get("path") || "";
}

function normalizeRequestUrl(req) {
  const originalUrl = req.url || "/";
  const url = new URL(originalUrl, "http://localhost");
  const rewritePath = readRewritePath(req, url);

  if (rewritePath) {
    url.searchParams.delete("path");
    const query = url.searchParams.toString();
    req.url = `/api/${String(rewritePath).replace(/^\/+/, "")}${query ? `?${query}` : ""}`;
    return;
  }

  if (originalUrl === "/api/index" || originalUrl.startsWith("/api/index?")) {
    req.url = `/api${url.search || ""}`;
    return;
  }

  if (!originalUrl.startsWith("/api")) {
    req.url = `/api${originalUrl.startsWith("/") ? originalUrl : `/${originalUrl}`}`;
  }
}

export default function handler(req, res) {
  normalizeRequestUrl(req);

  return app(req, res);
}
