import { useLanguage } from "../contexts/LanguageContext";

export default function LanguageToggle({ className = "" }) {
  const { language, languageLabels, setLanguage, t } = useLanguage();

  return (
    <div
      aria-label={t("settings.languageTitle")}
      className={`inline-grid grid-cols-2 rounded-full border border-[#ddd0bf] bg-white/80 p-1 shadow-sm ${className}`}
      role="group"
    >
      {Object.entries(languageLabels).map(([value, label]) => {
        const active = language === value;

        return (
          <button
            aria-pressed={active}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              active ? "bg-emerald-700 text-white shadow-sm" : "text-slate-600 hover:bg-[#fbf7ef]"
            }`}
            key={value}
            onClick={() => setLanguage(value)}
            type="button"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
