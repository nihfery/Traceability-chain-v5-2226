import express from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  clearNotifications,
  createNotification,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../utils/db.js";

const router = express.Router();
const ALLOWED_TYPES = new Set(["info", "success", "warning", "error"]);

function getUserId(req) {
  return req.user?.id || req.user?.email || "";
}

function normalizeNotificationType(type) {
  const normalized = String(type || "info").trim().toLowerCase();
  return ALLOWED_TYPES.has(normalized) ? normalized : "info";
}

function isMissingNotificationSchema(error) {
  return (
    error.message?.includes("Could not find the table") ||
    error.message?.includes("schema cache")
  );
}

function sendNotificationError(res, error) {
  console.error("Notification API error:", error);
  const missingSchema = isMissingNotificationSchema(error);

  return res.status(missingSchema ? 503 : 500).json({
    message: missingSchema
      ? "Tabel notifications Supabase belum siap. Jalankan migrasi Supabase dulu."
      : "Gagal memproses notifikasi",
  });
}

router.use(requireAuth);

router.get("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const limit = req.query.limit || 40;

    return res.json(await listNotifications(userId, limit));
  } catch (error) {
    return sendNotificationError(res, error);
  }
});

router.post("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    const title = String(req.body?.title || "").trim();

    if (!title) {
      return res.status(400).json({ message: "Judul notifikasi wajib diisi" });
    }

    const notification = await createNotification({
      userId,
      userEmail: req.user?.email || null,
      title,
      message: String(req.body?.message || "").trim(),
      to: String(req.body?.to || req.body?.targetPath || "").trim(),
      type: normalizeNotificationType(req.body?.type),
      read: false,
    });

    return res.status(201).json(notification);
  } catch (error) {
    return sendNotificationError(res, error);
  }
});

router.patch("/read", async (req, res) => {
  try {
    const userId = getUserId(req);
    const notifications = await markAllNotificationsRead(userId);

    return res.json({ updated: notifications.length });
  } catch (error) {
    return sendNotificationError(res, error);
  }
});

router.patch("/:id/read", async (req, res) => {
  try {
    const userId = getUserId(req);
    const notification = await markNotificationRead(userId, req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notifikasi tidak ditemukan" });
    }

    return res.json(notification);
  } catch (error) {
    return sendNotificationError(res, error);
  }
});

router.delete("/", async (req, res) => {
  try {
    const userId = getUserId(req);
    await clearNotifications(userId);

    return res.json({ ok: true });
  } catch (error) {
    return sendNotificationError(res, error);
  }
});

export default router;
