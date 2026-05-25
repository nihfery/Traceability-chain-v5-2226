import {
  CheckCircle2,
  CircleDotDashed,
  Clock3,
  ExternalLink,
  GitBranch,
  Link as LinkIcon,
  SkipForward,
} from "lucide-react";
import {
  formatDate,
  humanStage,
  shortHash,
  stageStatusClasses,
  stageStatusText,
} from "../utils/formatters";
import { useLanguage } from "../contexts/LanguageContext";

function StageIcon({ status }) {
  if (status === "completed") {
    return <CheckCircle2 size={16} />;
  }

  if (status === "skipped") {
    return <SkipForward size={16} />;
  }

  if (status === "available") {
    return <Clock3 size={16} />;
  }

  return <CircleDotDashed size={16} />;
}

function stageIconClasses(status) {
  switch (status) {
    case "completed":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "skipped":
      return "border-rose-200 bg-rose-50 text-rose-700";
    case "available":
      return "border-amber-200 bg-amber-50 text-amber-700";
    default:
      return "border-slate-200 bg-slate-50 text-slate-400";
  }
}

function MetaPill({ children }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
      <span className="truncate">{children}</span>
    </span>
  );
}

export default function StageTimeline({ stages = [], hideSkipped = false }) {
  const { language, t } = useLanguage();
  const visibleStages = hideSkipped ? stages.filter((stage) => stage.status !== "skipped") : stages;

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/50">
      <div className="flex min-w-0 items-center justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
        <h3 className="truncate text-sm font-semibold text-slate-950">{t("timeline.title")}</h3>
        <div className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold text-slate-600">
          <GitBranch size={13} />
          {t("timeline.badge")}
        </div>
      </div>

      {visibleStages.length ? (
        <div className="divide-y divide-slate-200">
          {visibleStages.map((stage, index) => {
            const finalized = stage.status === "completed" || stage.status === "skipped";

            return (
              <article key={stage.stageName} className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-x-3 gap-y-3 px-4 py-4 sm:px-5 md:grid-cols-[2rem_minmax(0,1fr)_auto]">
                <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${stageIconClasses(stage.status)}`}>
                  <StageIcon status={stage.status} />
                </div>

                <div className="min-w-0">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                    <p className="break-words text-sm font-semibold text-slate-950">
                      {index + 1}. {humanStage(stage.stageName, language)}
                    </p>
                    <div className="sm:hidden">
                      <span className={stageStatusClasses(stage.status)}>{stageStatusText(stage.status, language)}</span>
                    </div>
                  </div>

                  <p className="mt-1 break-words text-xs text-slate-500">
                    {finalized
                      ? `${stage.operator || t("common.operator")} - ${formatDate(stage.timestamp, language)}`
                      : stageStatusText(stage.status, language)}
                  </p>

                  <div className="mt-3 flex min-w-0 flex-wrap gap-2">
                    {stage.skippable && <MetaPill>{t("timeline.skippable")}</MetaPill>}
                    {!!stage.prerequisiteStages?.length && (
                      <MetaPill>
                        {t("timeline.prerequisite", { stages: stage.prerequisiteStages.map((item) => humanStage(item, language)).join(", ") })}
                      </MetaPill>
                    )}
                  </div>

                  {stage.status === "skipped" && stage.skipReason && (
                    <div className="mt-3 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                      <span className="font-semibold">{t("timeline.skipReason")}</span> {stage.skipReason}
                    </div>
                  )}

                  {finalized && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {stage.ipfsUrl && (
                        <a
                          href={stage.ipfsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary gap-2 !rounded-xl !px-3 !py-2 !text-xs"
                        >
                          <LinkIcon size={14} />
                          {shortHash(stage.ipfsCid)}
                        </a>
                      )}
                      {stage.txUrl && (
                        <a
                          href={stage.txUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn-secondary gap-2 !rounded-xl !px-3 !py-2 !text-xs"
                        >
                          <ExternalLink size={14} />
                          {shortHash(stage.txHash)}
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="hidden md:block">
                  <span className={stageStatusClasses(stage.status)}>{stageStatusText(stage.status, language)}</span>
                </div>

                {finalized && (
                  <div className="col-start-2 min-w-0 space-y-2 md:col-span-2">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">{t("timeline.supabaseRecord")}</p>
                      <p className="mt-1 break-all">{stage.historyId || "-"}</p>
                      <p className="mt-1 text-slate-500">{t("common.event")}: {stage.payload?.eventType || "-"}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-600">
                      <p className="font-semibold text-slate-800">{t("timeline.blockchainAnchor")}</p>
                      <p className={`mt-1 ${stage.txHash ? "break-all" : "break-words"}`}>
                        {stage.txHash || t("timeline.waitingCid")}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="px-4 py-6 text-sm text-slate-500 sm:px-5">
          {t("timeline.empty")}
        </div>
      )}
    </section>
  );
}
