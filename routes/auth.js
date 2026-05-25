import express from "express";
import jwt from "jsonwebtoken";
import { requireAuth } from "../middleware/auth.js";
import { getJwtSecret, isConfigError } from "../utils/env.js";
import {
  findUserByCredentials,
  findUserWithPasswordById,
  updateUserPassword,
} from "../utils/db.js";

const router = express.Router();
const MIN_PASSWORD_LENGTH = 6;

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi" });
    }

    const user = await findUserByCredentials(email, password);

    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      getJwtSecret(),
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    if (isConfigError(error)) {
      return res.status(503).json({ message: error.message });
    }

    const missingSchema = error.message?.includes("Could not find the table");

    return res.status(503).json({
      message: missingSchema
        ? "Schema Supabase belum siap. Jalankan migrasi supabase db push untuk membuat tabel users, batches, dan batch_history."
        : "Login gagal karena koneksi atau konfigurasi Supabase bermasalah",
    });
  }
});

router.put("/me/password", requireAuth, async (req, res) => {
  try {
    const currentPassword = String(req.body?.currentPassword || "");
    const newPassword = String(req.body?.newPassword || "").trim();

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Password lama dan password baru wajib diisi" });
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password baru minimal ${MIN_PASSWORD_LENGTH} karakter` });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "Password baru harus berbeda dari password lama" });
    }

    const user = await findUserWithPasswordById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    if (user.password !== currentPassword) {
      return res.status(401).json({ message: "Password lama salah" });
    }

    const updatedUser = await updateUserPassword(req.user.id, newPassword);

    return res.json({
      message: "Password berhasil diperbarui",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Change password error:", error);
    const missingSchema = error.message?.includes("Could not find the table");

    return res.status(missingSchema ? 503 : 500).json({
      message: missingSchema
        ? "Schema Supabase belum siap. Jalankan migrasi Supabase dulu."
        : "Gagal memperbarui password",
    });
  }
});

export default router;
