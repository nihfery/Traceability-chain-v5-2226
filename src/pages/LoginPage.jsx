import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import LanguageToggle from "../components/LanguageToggle";

const LOGO_SRC = "/logo_tealabs.png";

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await login(form.email, form.password);
    if (!result.ok) setError(result.message);
  };

  return (
    <div className="login-page-shell flex min-h-screen items-center justify-center overflow-hidden px-4 py-6 sm:px-6">
      <section className="login-glass-card w-full max-w-md p-5 sm:p-7 lg:p-8">
        <div className="mb-4 flex justify-end">
          <LanguageToggle />
        </div>
        <div className="mb-6 text-center sm:mb-7">
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-[28px] border border-emerald-100 bg-white/90 shadow-lg shadow-emerald-900/10 sm:h-28 sm:w-28">
            <img
              src={LOGO_SRC}
              alt="Tealabs"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
            <ShieldCheck size={13} />
            {t("login.badge")}
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{t("login.title")}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">{t("login.subtitle")}</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label">{t("login.email")}</label>
            <div className="relative">
              <span className="login-input-icon left-3">
                <MailCheck size={17} />
              </span>
              <input
                autoComplete="email"
                className="input login-input-with-icon"
                placeholder={t("login.emailPlaceholder")}
                type="email"
                value={form.email}
                onChange={(event) => updateForm("email", event.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">{t("login.password")}</label>
            <div className="relative">
              <span className="login-input-icon left-3">
                <KeyRound size={17} />
              </span>
              <input
                autoComplete="current-password"
                className="input login-input-with-icon login-input-with-action"
                placeholder={t("login.passwordPlaceholder")}
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(event) => updateForm("password", event.target.value)}
              />
              <button
                aria-label={showPassword ? t("login.hidePassword") : t("login.showPassword")}
                className="login-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary min-h-12 w-full gap-2" disabled={loading}>
            {loading ? t("common.loading") : t("login.submit")}
            {!loading && <ArrowRight size={17} />}
          </button>
        </form>
      </section>
    </div>
  );
}
