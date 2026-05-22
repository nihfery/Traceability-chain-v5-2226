import express from "express";
import jwt from "jsonwebtoken";
import { findUserByCredentials } from "../utils/db.js";

const router = express.Router();

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
      process.env.JWT_SECRET || "super-secret-key",
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
    const missingSchema = error.message?.includes("Could not find the table");

    return res.status(503).json({
      message: missingSchema
        ? "Schema Supabase belum siap. Jalankan migrasi supabase db push untuk membuat tabel users, batches, dan batch_history."
        : "Login gagal karena koneksi atau konfigurasi Supabase bermasalah",
    });
  }
});

export default router;
