import jwt from "jsonwebtoken";
import { getJwtSecret, isConfigError } from "../utils/env.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded;
    next();
  } catch (error) {
    if (isConfigError(error)) {
      return res.status(503).json({ message: error.message });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
}
