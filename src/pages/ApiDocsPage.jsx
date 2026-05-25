import { useState } from "react";
import { BookOpen, KeyRound, LockKeyhole, Save, Server } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import Topbar from "../components/Topbar";
import api from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

const methodClasses = {
  GET: "bg-sky-100 text-sky-800",
  POST: "bg-emerald-100 text-emerald-800",
  PATCH: "bg-amber-100 text-amber-800",
  PUT: "bg-violet-100 text-violet-800",
  DELETE: "bg-rose-100 text-rose-800",
};

function JsonBlock({ value }) {
  if (!value) {
    return null;
  }

  return (
    <pre className="mt-2 max-h-72 max-w-full overflow-auto whitespace-pre-wrap break-words rounded-xl border border-[#eadfce] bg-white/85 p-2.5 text-[11px] leading-5 text-slate-700 sm:rounded-2xl sm:p-3 sm:text-xs">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function SectionCard({ children, className = "" }) {
  return <section className={`card min-w-0 overflow-hidden p-3 sm:p-5 lg:p-6 ${className}`}>{children}</section>;
}

function SurfacePanel({ children }) {
  return (
    <div className="surface-muted min-w-0 overflow-hidden rounded-[18px] p-3 sm:rounded-[22px] sm:p-4">
      {children}
    </div>
  );
}

function EndpointCode({ children, compact = false }) {
  return (
    <code
      className={`block min-w-0 max-w-full break-all rounded-xl bg-white text-slate-800 ring-1 ring-[#eadfce] ${
        compact ? "px-2.5 py-2 text-xs font-semibold" : "px-2.5 py-1.5 text-xs font-semibold sm:text-sm"
      }`}
    >
      {children}
    </code>
  );
}

export default function ApiDocsPage() {
  const { openSidebar } = useOutletContext();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [changeForm, setChangeForm] = useState({ currentPassword: "", newPassword: "" });
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError] = useState("");
  const [changeMessage, setChangeMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setChangeError("");
    setChangeMessage("");

    try {
      const response = await api.get("/system/api-docs", {
        headers: {
          "X-API-Docs-Password": password,
        },
      });
      setDocs(response.data);
      setPassword("");
    } catch (err) {
      setDocs(null);
      setError(err.response?.data?.message || t("apiDocs.unlockFailed"));
    } finally {
      setLoading(false);
    }
  };

  const updateChangeForm = (field, value) => {
    setChangeForm((current) => ({ ...current, [field]: value }));
  };

  const resetDocsLock = () => {
    setDocs(null);
    setChangeForm({ currentPassword: "", newPassword: "" });
    setChangeError("");
    setChangeMessage("");
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setChangeLoading(true);
    setChangeError("");
    setChangeMessage("");

    try {
      const response = await api.put("/system/api-docs/password", changeForm);
      setChangeMessage(response.data?.message || t("apiDocs.changePasswordSuccess"));
      setChangeForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setChangeError(err.response?.data?.message || t("apiDocs.changePasswordFailed"));
    } finally {
      setChangeLoading(false);
    }
  };

  return (
    <div>
      <Topbar title={t("apiDocs.title")} onOpenMenu={openSidebar} />

      <div className="min-w-0 space-y-4 overflow-x-hidden p-2.5 sm:p-4 lg:space-y-6 lg:p-8">
        {!docs ? (
          <form className="card-paper mx-auto max-w-xl overflow-hidden p-4 sm:p-6 lg:p-8" onSubmit={handleSubmit}>
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                <LockKeyhole size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-slate-900">{t("apiDocs.lockedTitle")}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">{t("apiDocs.lockedDescription")}</p>
              </div>
            </div>

            <div className="mt-6">
              <label className="label">{t("apiDocs.password")}</label>
              <div className="relative">
                <span className="login-input-icon left-3">
                  <KeyRound size={17} />
                </span>
                <input
                  className="input login-input-with-icon"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

            <button className="btn-primary mt-6 w-full" type="submit" disabled={loading}>
              {loading ? t("common.loading") : t("apiDocs.unlock")}
            </button>
          </form>
        ) : (
          <>
            <div className="card-paper min-w-0 overflow-hidden p-3 sm:p-5 lg:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                    <BookOpen size={14} />
                    <span className="truncate">{t("apiDocs.badge")}</span>
                  </div>
                  <h2 className="mt-4 break-words text-xl font-bold text-slate-900 sm:text-2xl">{docs.title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{docs.mobileAccess}</p>
                </div>
                <button className="btn-secondary w-full sm:w-auto" type="button" onClick={resetDocsLock}>
                  {t("apiDocs.lockAgain")}
                </button>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                <SurfacePanel>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Server size={16} />
                    {t("apiDocs.basePath")}
                  </div>
                  <div className="mt-2 break-all text-sm text-slate-600">{docs.basePath}</div>
                </SurfacePanel>
                <SurfacePanel>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <KeyRound size={16} />
                    {t("apiDocs.auth")}
                  </div>
                  <div className="mt-2 break-all text-sm text-slate-600">{docs.auth?.header}</div>
                  <div className="mt-1 text-xs text-slate-500">{docs.auth?.note}</div>
                </SurfacePanel>
                <SurfacePanel>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                    <Server size={16} />
                    {t("apiDocs.baseUrls")}
                  </div>
                  <JsonBlock value={docs.baseUrls} />
                </SurfacePanel>
              </div>
            </div>

            <SectionCard>
              <div className="flex items-start gap-3">
                <div className="shrink-0 rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                  <KeyRound size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.changePasswordTitle")}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{t("apiDocs.changePasswordDescription")}</p>
                </div>
              </div>

              <form className="mt-5 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" onSubmit={handleChangePassword}>
                <div className="min-w-0">
                  <label className="label">{t("apiDocs.currentPassword")}</label>
                  <input
                    className="input"
                    type="password"
                    value={changeForm.currentPassword}
                    onChange={(event) => updateChangeForm("currentPassword", event.target.value)}
                    autoComplete="current-password"
                  />
                </div>
                <div className="min-w-0">
                  <label className="label">{t("apiDocs.newPassword")}</label>
                  <input
                    className="input"
                    type="password"
                    value={changeForm.newPassword}
                    onChange={(event) => updateChangeForm("newPassword", event.target.value)}
                    autoComplete="new-password"
                    minLength={docs.security?.apiDocsPasswordMinLength || 6}
                  />
                </div>
                <button className="btn-primary mt-0 gap-2 lg:mt-7" type="submit" disabled={changeLoading}>
                  <Save size={16} />
                  {changeLoading ? t("common.loading") : t("apiDocs.updatePassword")}
                </button>
              </form>

              {changeError && <div className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{changeError}</div>}
              {changeMessage && (
                <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{changeMessage}</div>
              )}
            </SectionCard>

            <div className="grid gap-5 xl:grid-cols-2">
              <SectionCard>
                <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.environmentVariables")}</h3>
                <JsonBlock value={docs.environmentVariables} />
              </SectionCard>

              <SectionCard>
                <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.productionChecklist")}</h3>
                <JsonBlock value={docs.productionChecklist} />
              </SectionCard>
            </div>

            <SectionCard>
              <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.mobileFlow")}</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {docs.mobileFlow?.map((step) => (
                  <div key={step.order} className="min-w-0 overflow-hidden rounded-[18px] border border-[#e7ddcf] bg-[rgba(249,246,240,0.92)] p-3 sm:rounded-[22px] sm:p-4">
                    <div className="flex min-w-0 items-start gap-2">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                        {step.order}
                      </span>
                      <div className="min-w-0 break-words text-sm font-bold text-slate-900">{step.title}</div>
                    </div>
                    <div className="mt-3">
                      <EndpointCode compact>{step.endpoint}</EndpointCode>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">{step.result}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <div className="grid gap-5 xl:grid-cols-2">
              <SectionCard>
                <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.enums")}</h3>
                <JsonBlock value={docs.enums} />
              </SectionCard>

              <SectionCard>
                <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.commonErrors")}</h3>
                <JsonBlock value={docs.commonErrors} />
              </SectionCard>

              <SectionCard>
                <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.productionFlows")}</h3>
                <JsonBlock value={docs.productionFlows} />
              </SectionCard>

              <SectionCard>
                <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.stageFields")}</h3>
                <JsonBlock value={docs.stageFieldTemplates} />
              </SectionCard>
            </div>

            <SectionCard>
              <h3 className="text-lg font-bold text-slate-900">{t("apiDocs.responseModels")}</h3>
              <JsonBlock value={docs.responseModels} />
            </SectionCard>

            <div className="space-y-5">
              {docs.groups?.map((group) => (
                <SectionCard key={group.title}>
                  <h3 className="text-lg font-bold text-slate-900">{group.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{group.description}</p>

                  <div className="mt-5 space-y-4">
                    {group.endpoints.map((endpoint) => (
                      <div key={`${endpoint.method}-${endpoint.path}`} className="min-w-0 overflow-hidden rounded-[18px] border border-[#e7ddcf] bg-[rgba(249,246,240,0.92)] p-3 sm:rounded-[22px] sm:p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div className="min-w-0">
                            <div className="grid min-w-0 grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center">
                              <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold ${methodClasses[endpoint.method] || "bg-slate-100 text-slate-700"}`}>
                                {endpoint.method}
                              </span>
                              <EndpointCode>{endpoint.path}</EndpointCode>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-slate-600">{endpoint.description}</p>
                          </div>
                          <div className="flex min-w-0 flex-wrap gap-2 lg:max-w-56 lg:justify-end">
                            <span className="min-w-0 max-w-full break-words rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-[#eadfce]">
                              {endpoint.access}
                            </span>
                            {endpoint.mobileUse && (
                              <span className="min-w-0 max-w-full break-words rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                {t("apiDocs.mobileUse")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 grid min-w-0 gap-3 lg:grid-cols-2">
                          {endpoint.headers && (
                            <div className="min-w-0">
                              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t("apiDocs.headers")}</div>
                              <JsonBlock value={endpoint.headers} />
                            </div>
                          )}
                          {endpoint.params && (
                            <div className="min-w-0">
                              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t("apiDocs.params")}</div>
                              <JsonBlock value={endpoint.params} />
                            </div>
                          )}
                          {endpoint.body && (
                            <div className="min-w-0">
                              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t("apiDocs.body")}</div>
                              <JsonBlock value={endpoint.body} />
                            </div>
                          )}
                          {endpoint.examples && (
                            <div className="min-w-0">
                              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t("apiDocs.examples")}</div>
                              <JsonBlock value={endpoint.examples} />
                            </div>
                          )}
                          {endpoint.success && (
                            <div className="min-w-0">
                              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t("apiDocs.success")}</div>
                              <JsonBlock value={endpoint.success} />
                            </div>
                          )}
                          {endpoint.errors && (
                            <div className="min-w-0">
                              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t("apiDocs.errors")}</div>
                              <JsonBlock value={endpoint.errors} />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
