import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { humanFieldLabel, humanStage } from "../utils/formatters";
import { getApiErrorMessage } from "../utils/apiErrors";
import { useLanguage } from "../contexts/LanguageContext";
import { useNotifications } from "../contexts/NotificationContext";

export const stageTemplates = {
  plucking: { operatorShift: "", leafGrade: "", weightKg: "", location: "", notes: "" },
  withering: { durationMinutes: "", temperature: "", humidity: "", weightBeforeKg: "", weightAfterKg: "", notes: "" },
  rolling: { durationMinutes: "", machineCode: "", rpm: "", outputKg: "", notes: "" },
  predrying: { temperature: "", durationMinutes: "", moisturePercent: "", notes: "" },
  drying: { dryerMachine: "", temperature: "", durationMinutes: "", finalMoisturePercent: "", notes: "" },
  postdrying: { sortingGrade: "", qcStatus: "", aromaNote: "", notes: "" },
  packing: { packageType: "", totalPackage: "", netWeightKg: "", warehouseLocation: "", notes: "" },
};

function createInitialForm(stageName) {
  return { ...(stageTemplates[stageName] || { notes: "" }) };
}

export default function StageInputForm({
  batchId,
  batchCode,
  stageName,
  onCancel,
  onSubmitted,
  showTitle = false,
  className = "",
}) {
  const { language, t } = useLanguage();
  const { addNotification } = useNotifications();
  const [form, setForm] = useState(() => createInitialForm(stageName));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(createInitialForm(stageName));
    setError("");
  }, [stageName]);

  const fields = useMemo(() => Object.keys(form), [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post(`/batches/${batchId}/stages/${stageName}`, form);
      addNotification({
        title: t("notifications.stageSavedTitle"),
        message: t("notifications.stageSavedMessage", {
          batchCode: data?.batchCode || batchCode || t("common.batch"),
          stage: humanStage(stageName, language),
        }),
        to: `/batches/${batchId}`,
        type: "success",
      });
      await onSubmitted?.();
    } catch (err) {
      setError(getApiErrorMessage(err, language, t("stageForm.error")));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4 ${className}`} onSubmit={handleSubmit}>
      {showTitle && (
        <h3 className="mb-4 text-sm font-semibold text-slate-950">
          {t("stageForm.title", { stage: humanStage(stageName, language) })}
        </h3>
      )}

      <div className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field} className={field === "notes" ? "md:col-span-2" : ""}>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600">{humanFieldLabel(field, language)}</label>
            {field === "notes" ? (
              <textarea
                className="input min-h-24 !rounded-xl !px-3 !py-2.5 !text-sm"
                value={form[field]}
                onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
              />
            ) : (
              <input
                className="input !rounded-xl !px-3 !py-2.5 !text-sm"
                value={form[field]}
                onChange={(event) => setForm((prev) => ({ ...prev, [field]: event.target.value }))}
                placeholder={t("stageForm.placeholder", { field: humanFieldLabel(field, language) })}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        {onCancel && (
          <button type="button" className="btn-secondary w-full !rounded-xl !px-3 !py-2.5 !text-xs sm:w-auto" onClick={onCancel}>
            {t("common.cancel")}
          </button>
        )}
        <button type="submit" className="btn-primary w-full !rounded-xl !px-3 !py-2.5 !text-xs sm:w-auto" disabled={loading}>
          {loading ? t("stageForm.saving") : t("stageForm.save")}
        </button>
      </div>
    </form>
  );
}
