import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  ChevronDown,
  Inbox,
  LogOut,
  Menu,
  Settings,
  Trash2,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import WalletConnectButton from "./WalletConnectButton";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNotifications } from "../contexts/NotificationContext";

function getInitials(name = "", email = "") {
  const source = name || email || "User";
  const parts = source.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function formatNotificationTime(value, language) {
  if (!value) return "";

  try {
    return new Intl.DateTimeFormat(language === "en" ? "en-US" : "id-ID", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

function notificationTypeClass(type) {
  switch (type) {
    case "success":
      return "bg-emerald-500";
    case "warning":
      return "bg-amber-500";
    case "error":
      return "bg-rose-500";
    default:
      return "bg-sky-500";
  }
}

export default function Topbar({
  title,
  onOpenMenu,
}) {
  const { logout, user } = useAuth();
  const { language, t } = useLanguage();
  const {
    clearNotifications,
    markAllRead,
    markRead,
    notifications,
    unreadCount,
  } = useNotifications();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }

      if (!notificationRef.current?.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const initials = getInitials(user?.name, user?.email);

  return (
    <header className="sticky top-0 z-20 border-b border-[rgba(214,204,190,0.8)] bg-[rgba(250,247,241,0.93)] px-3 py-2.5 backdrop-blur sm:px-4 sm:py-3 lg:px-6">
      <div className="topbar-shell">
        <button
          className="sidebar-toggle-button topbar-menu shrink-0 overflow-hidden rounded-2xl border border-[#ddd0bf] bg-white text-slate-700 shadow-sm transition hover:bg-[#fbf7ef]"
          onClick={onOpenMenu}
          title={t("sidebar.toggle")}
          type="button"
        >
          <Menu size={18} />
        </button>

        <div className="topbar-brand min-w-0">
          <div className="inline-flex h-9 max-w-full items-center truncate rounded-full border border-[#e6dccd] bg-white/80 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#6f7d6d] shadow-sm sm:h-auto sm:px-3 sm:py-1 sm:text-[11px] sm:tracking-[0.22em]">
            Tealabs
          </div>
        </div>

        <div className="topbar-title min-w-0">
          <h2 className="topbar-heading break-words font-bold tracking-tight text-slate-900">{title}</h2>
        </div>

        <div className="topbar-actions">
          <div className="min-w-0">
            <WalletConnectButton />
          </div>

          <div className="relative" ref={notificationRef}>
            <button
              className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#ddd0bf] bg-white text-slate-700 shadow-sm transition hover:bg-[#fbf7ef]"
              onClick={() => setNotificationOpen((current) => !current)}
              title={t("topbar.notifications")}
              type="button"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border-2 border-white bg-emerald-600 px-1 text-[10px] font-bold leading-none text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationOpen && (
              <div className="absolute right-[-3.25rem] mt-2 w-[min(22rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 sm:right-0">
                <div className="flex items-start justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-950">{t("notifications.title")}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {t("notifications.unreadCount", { count: unreadCount })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-emerald-700"
                      onClick={markAllRead}
                      title={t("notifications.markAllRead")}
                      type="button"
                    >
                      <CheckCheck size={16} />
                    </button>
                    <button
                      className="grid h-8 w-8 place-items-center rounded-full text-slate-500 transition hover:bg-white hover:text-rose-700"
                      onClick={clearNotifications}
                      title={t("notifications.clearAll")}
                      type="button"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length ? (
                    notifications.map((item) => {
                      const content = (
                        <>
                          <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? "bg-slate-300" : notificationTypeClass(item.type)}`} />
                          <span className="min-w-0 flex-1">
                            <span className="block break-words text-sm font-semibold text-slate-950">{item.title}</span>
                            {item.message && (
                              <span className="mt-1 block break-words text-xs leading-5 text-slate-500">{item.message}</span>
                            )}
                            <span className="mt-2 block text-[11px] font-medium text-slate-400">
                              {formatNotificationTime(item.createdAt, language)}
                            </span>
                          </span>
                        </>
                      );

                      const className = `flex w-full min-w-0 gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 ${
                        item.read ? "bg-white hover:bg-slate-50" : "bg-emerald-50/45 hover:bg-emerald-50"
                      }`;

                      if (item.to) {
                        return (
                          <Link
                            key={item.id}
                            to={item.to}
                            className={className}
                            onClick={() => {
                              markRead(item.id);
                              setNotificationOpen(false);
                            }}
                          >
                            {content}
                          </Link>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          className={className}
                          onClick={() => markRead(item.id)}
                          type="button"
                        >
                          {content}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-slate-50 text-slate-400">
                        <Inbox size={18} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-700">{t("notifications.emptyTitle")}</p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">{t("notifications.emptyDescription")}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              className="flex h-11 w-11 min-w-0 items-center justify-center gap-2 rounded-full border border-[#ddd0bf] bg-white p-1 text-left text-slate-800 shadow-sm transition hover:bg-[#fbf7ef] sm:w-auto sm:justify-start sm:p-1.5 sm:pr-3"
              onClick={() => setProfileOpen((current) => !current)}
              type="button"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                {initials}
              </span>
              <span className="hidden min-w-0 sm:block">
                <span className="block max-w-32 truncate text-xs font-semibold text-slate-900">{user?.name || t("topbar.myProfile")}</span>
                <span className="block max-w-32 truncate text-[11px] text-slate-500">{user?.role || t("common.active")}</span>
              </span>
              <ChevronDown size={14} className={`hidden shrink-0 text-slate-500 transition sm:block ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-[min(18rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10">
                <div className="border-b border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-950">{user?.name || "-"}</div>
                      <div className="mt-0.5 truncate text-xs text-slate-500">{user?.email || "-"}</div>
                    </div>
                  </div>
                  <div className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {user?.role || t("common.active")}
                  </div>
                </div>

                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={16} />
                    {t("topbar.myProfile")}
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Settings size={16} />
                    {t("common.settings")}
                  </Link>
                  <button
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                    onClick={logout}
                    type="button"
                  >
                    <LogOut size={16} />
                    {t("sidebar.logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
