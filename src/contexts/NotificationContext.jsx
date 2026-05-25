import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const MAX_NOTIFICATIONS = 40;
const LOCAL_ID_PREFIX = "local-notification";

function createLocalId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `${LOCAL_ID_PREFIX}-${crypto.randomUUID()}`;
  }

  return `${LOCAL_ID_PREFIX}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeNotification(notification) {
  return {
    id: notification.id,
    title: String(notification.title || "").trim(),
    message: String(notification.message || "").trim(),
    to: notification.to || notification.targetPath || "",
    type: notification.type || "info",
    read: Boolean(notification.read),
    createdAt: notification.createdAt || notification.created_at || new Date().toISOString(),
  };
}

function isLocalNotification(id) {
  return String(id || "").startsWith(LOCAL_ID_PREFIX);
}

const NotificationContext = createContext(null);

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const userKey = user?.id || user?.email || "";
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userKey) {
      setNotifications([]);
      return;
    }

    let active = true;

    api
      .get("/notifications", {
        params: { limit: MAX_NOTIFICATIONS },
      })
      .then((response) => {
        if (!active) return;
        const rows = Array.isArray(response.data) ? response.data : [];
        setNotifications(rows.map(normalizeNotification).slice(0, MAX_NOTIFICATIONS));
      })
      .catch(() => {
        if (active) {
          setNotifications([]);
        }
      });

    return () => {
      active = false;
    };
  }, [userKey]);

  const addNotification = useCallback(({ title, message, to, type = "info" }) => {
    const trimmedTitle = String(title || "").trim();
    if (!trimmedTitle || !userKey) return;

    const localNotification = normalizeNotification({
      id: createLocalId(),
      title: trimmedTitle,
      message,
      to,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    });

    setNotifications((current) => [
      localNotification,
      ...current,
    ].slice(0, MAX_NOTIFICATIONS));

    api
      .post("/notifications", {
        title: localNotification.title,
        message: localNotification.message,
        to: localNotification.to,
        type: localNotification.type,
      })
      .then((response) => {
        const savedNotification = normalizeNotification(response.data);
        setNotifications((current) => [
          savedNotification,
          ...current.filter((item) => item.id !== localNotification.id),
        ].slice(0, MAX_NOTIFICATIONS));
      })
      .catch(() => {
        setNotifications((current) => current.filter((item) => item.id !== localNotification.id));
      });
  }, [userKey]);

  const markRead = useCallback((id) => {
    setNotifications((current) =>
      current.map((item) => (item.id === id ? { ...item, read: true } : item))
    );

    if (userKey && !isLocalNotification(id)) {
      api.patch(`/notifications/${id}/read`).catch(() => {});
    }
  }, [userKey]);

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));

    if (userKey) {
      api.patch("/notifications/read").catch(() => {});
    }
  }, [userKey]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);

    if (userKey) {
      api.delete("/notifications").catch(() => {});
    }
  }, [userKey]);

  const value = useMemo(() => ({
    addNotification,
    clearNotifications,
    markAllRead,
    markRead,
    notifications,
    unreadCount: notifications.filter((item) => !item.read).length,
  }), [addNotification, clearNotifications, markAllRead, markRead, notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }

  return context;
}
