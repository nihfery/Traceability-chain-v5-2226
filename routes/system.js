import express from "express";
import { randomUUID, scryptSync, timingSafeEqual } from "crypto";
import { getBlockchainStatus } from "../services/blockchain.js";
import { getPinataStatus } from "../services/pinata.js";
import { getAppSetting, getStorageStatus, upsertAppSetting } from "../utils/db.js";
import { API_DOCS } from "../utils/apiDocs.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
const DEFAULT_API_DOCS_PASSWORD = "api-docs-admin";
const API_DOCS_PASSWORD_KEY = "api_docs_password";
const MIN_API_DOCS_PASSWORD_LENGTH = 6;

function hashApiDocsPassword(password) {
  const salt = randomUUID();
  const hash = scryptSync(password, salt, 64).toString("hex");

  return `scrypt:${salt}:${hash}`;
}

function verifyApiDocsPassword(password, storedValue) {
  if (!storedValue) {
    return password === DEFAULT_API_DOCS_PASSWORD;
  }

  if (!storedValue.startsWith("scrypt:")) {
    return password === storedValue;
  }

  try {
    const [, salt, hash] = storedValue.split(":");
    if (!salt || !hash) {
      return false;
    }

    const storedHash = Buffer.from(hash, "hex");
    const submittedHash = scryptSync(password, salt, 64);

    if (storedHash.length !== submittedHash.length) {
      return false;
    }

    return timingSafeEqual(storedHash, submittedHash);
  } catch {
    return false;
  }
}

async function getApiDocsPasswordSetting() {
  try {
    const setting = await getAppSetting(API_DOCS_PASSWORD_KEY);
    if (setting?.value) {
      return setting;
    }
  } catch (error) {
    console.error("Gagal membaca password API Docs dari Supabase:", error);
  }

  return {
    key: API_DOCS_PASSWORD_KEY,
    value: process.env.API_DOCS_PASSWORD || DEFAULT_API_DOCS_PASSWORD,
    updatedAt: null,
    updatedBy: "env",
  };
}

router.get("/web3-status", (req, res) => {
  res.json({
    storage: getStorageStatus(),
    blockchain: getBlockchainStatus(),
    ipfs: getPinataStatus(),
  });
});

router.get("/api-docs", async (req, res) => {
  const password = req.get("X-API-Docs-Password") || "";
  const setting = await getApiDocsPasswordSetting();

  if (!verifyApiDocsPassword(password, setting.value)) {
    return res.status(401).json({ message: "Password API Docs salah" });
  }

  return res.json(API_DOCS);
});

router.put("/api-docs/password", requireAuth, async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ message: "Hanya admin yang bisa mengubah password API Docs" });
    }

    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "").trim();

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Password lama dan password baru wajib diisi" });
    }

    if (newPassword.length < MIN_API_DOCS_PASSWORD_LENGTH) {
      return res.status(400).json({ message: "Password baru minimal 6 karakter" });
    }

    const setting = await getApiDocsPasswordSetting();
    if (!verifyApiDocsPassword(currentPassword, setting.value)) {
      return res.status(401).json({ message: "Password API Docs lama salah" });
    }

    const savedSetting = await upsertAppSetting(
      API_DOCS_PASSWORD_KEY,
      hashApiDocsPassword(newPassword),
      req.user.email || req.user.name || req.user.id || "admin"
    );

    return res.json({
      message: "Password API Docs berhasil diperbarui",
      updatedAt: savedSetting.updatedAt,
      updatedBy: savedSetting.updatedBy,
    });
  } catch (error) {
    console.error("Gagal mengubah password API Docs:", error);
    const missingSchema =
      error.message?.includes("Could not find the table") || error.message?.includes("schema cache");

    return res.status(missingSchema ? 503 : 500).json({
      message: missingSchema
        ? "Tabel app_settings Supabase belum siap. Jalankan migrasi Supabase dulu."
        : "Gagal mengubah password API Docs",
    });
  }
});

export default router;
