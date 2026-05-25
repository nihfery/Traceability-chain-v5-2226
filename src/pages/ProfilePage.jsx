import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  KeyRound,
  Mail,
  Shield,
  UserRound,
} from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import Topbar from "../components/Topbar";
import api from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

function ProfileInfo({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-emerald-700 shadow-sm">
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="mt-1 break-words text-sm font-semibold text-slate-950">{value || "-"}</div>
      </div>
    </div>
  );
}

function ResetWarningModal({ loading, onCancel, onConfirm, t }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-amber-200 bg-white text-amber-700">
              <AlertTriangle size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-950">{t("profile.confirmTitle")}</h3>
              <p className="mt-1 text-sm leading-6 text-amber-900">{t("profile.confirmDescription")}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 p-4 sm:flex-row sm:justify-end sm:p-5">
          <button
            className="btn-secondary w-full !rounded-xl !px-4 !py-2.5 sm:w-auto"
            disabled={loading}
            onClick={onCancel}
            type="button"
          >
            {t("common.cancel")}
          </button>
          <button
            className="btn-primary w-full !rounded-xl !px-4 !py-2.5 sm:w-auto"
            disabled={loading}
            onClick={onConfirm}
            type="button"
          >
            {loading ? t("profile.resetting") : t("profile.confirmAction")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { openSidebar } = useOutletContext();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleRequestReset = (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError(t("profile.passwordRequired"));
      return;
    }

    if (form.newPassword.length < 6) {
      setError(t("profile.passwordMin"));
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError(t("profile.passwordMismatch"));
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmReset = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await api.put("/auth/me/password", {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setConfirmOpen(false);
      setSuccess(data?.message || t("profile.passwordSuccess"));
    } catch (err) {
      setConfirmOpen(false);
      setError(err.response?.data?.message || t("profile.passwordFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Topbar title={t("profile.title")} onOpenMenu={openSidebar} />

      <main className="p-3 sm:p-4 lg:p-8">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/"
            className="mb-4 inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50 transition hover:bg-slate-50"
            title={`${t("common.back")} ${t("dashboard.title")}`}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">{t("dashboard.title")}</span>
          </Link>
        </div>

        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <section className="card-paper min-w-0 p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-700 text-base font-bold text-white">
                {(user?.name || user?.email || "U").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="break-words text-lg font-bold text-slate-950">{user?.name || "-"}</h3>
                <p className="mt-1 break-words text-sm text-slate-500">{user?.email || "-"}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <ProfileInfo icon={UserRound} label={t("profile.name")} value={user?.name} />
              <ProfileInfo icon={Mail} label={t("profile.email")} value={user?.email} />
              <ProfileInfo icon={Shield} label={t("profile.role")} value={user?.role} />
            </div>
          </section>

          <section className="card-paper min-w-0 p-4 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="inline-flex rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                <KeyRound size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-950">{t("profile.resetPassword")}</h3>
            </div>

            <form className="space-y-4" onSubmit={handleRequestReset}>
              <div>
                <label className="label">{t("profile.currentPassword")}</label>
                <input
                  autoComplete="current-password"
                  className="input"
                  name="currentPassword"
                  onChange={handleChange}
                  type="password"
                  value={form.currentPassword}
                />
              </div>

              <div>
                <label className="label">{t("profile.newPassword")}</label>
                <input
                  autoComplete="new-password"
                  className="input"
                  name="newPassword"
                  onChange={handleChange}
                  type="password"
                  value={form.newPassword}
                />
              </div>

              <div>
                <label className="label">{t("profile.confirmPassword")}</label>
                <input
                  autoComplete="new-password"
                  className="input"
                  name="confirmPassword"
                  onChange={handleChange}
                  type="password"
                  value={form.confirmPassword}
                />
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  {success}
                </div>
              )}

              <button className="btn-primary w-full !rounded-xl" disabled={loading} type="submit">
                {loading ? t("profile.resetting") : t("profile.resetPassword")}
              </button>
            </form>
          </section>
        </div>
      </main>

      {confirmOpen && (
        <ResetWarningModal
          loading={loading}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmReset}
          t={t}
        />
      )}
    </div>
  );
}
