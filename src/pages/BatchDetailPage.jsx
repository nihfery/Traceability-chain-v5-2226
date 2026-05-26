import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
  Link2,
  Play,
  SkipForward,
} from "lucide-react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import StageTimeline from "../components/StageTimeline";
import ManualBlockchainAnchor from "../components/ManualBlockchainAnchor";
import TraceabilityQrCode, { getPublicTraceabilityPath } from "../components/TraceabilityQrCode";
import ProductionFlowGuide from "../components/ProductionFlowGuide";
import StageInputForm from "../components/StageInputForm";
import api from "../services/api";
import {
  formatDate,
  getActiveStages,
  getSkippableStages,
  humanStage,
  humanTeaType,
  humanWorkflowMode,
  shortHash,
  stageStatusText,
  statusClasses,
  statusText,
} from "../utils/formatters";
import { useLanguage } from "../contexts/LanguageContext";
import { useNotifications } from "../contexts/NotificationContext";
import { getApiErrorMessage } from "../utils/apiErrors";

function Panel({ title, action, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/50 sm:p-5 ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
          {title && <h3 className="truncate text-sm font-semibold text-slate-950">{title}</h3>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function MetaItem({ label, value, children }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
      <div className="mt-1 min-w-0 break-words text-sm font-semibold text-slate-900">
        {children || value || "-"}
      </div>
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-3 py-3 text-sm text-slate-500">
      {children}
    </div>
  );
}

function ReadyStagesPanel({ activeStageName, batch, language, onSelectStage, onSubmitted, stages, t }) {
  return (
    <Panel title={t("batchDetail.readyStages")}>
      <div className="space-y-2">
        {stages.length ? (
          stages.map((stage) => (
            <div key={stage.stageName} className="min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-3">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-950">{humanStage(stage.stageName, language)}</div>
                </div>
                <button
                  className="btn-primary min-h-10 w-full gap-2 !rounded-xl !px-3 !py-2.5 !text-xs sm:w-auto"
                  onClick={() => onSelectStage(stage.stageName)}
                  type="button"
                >
                  <Play size={14} />
                  {activeStageName === stage.stageName ? t("common.cancel") : t("batchDetail.inputStage")}
                </button>
              </div>

              {activeStageName === stage.stageName && (
                <StageInputForm
                  batchId={batch.id}
                  batchCode={batch.batchCode}
                  stageName={stage.stageName}
                  className="mt-3"
                  onCancel={() => onSelectStage("")}
                  onSubmitted={onSubmitted}
                />
              )}
            </div>
          ))
        ) : (
          <EmptyState>{t("batchDetail.noActive")}</EmptyState>
        )}
      </div>
    </Panel>
  );
}

function SkippableStagesPanel({ stages, language, loadingKey, onSkip, t }) {
  return (
    <Panel title={t("batchDetail.skippableStages")}>
      <div className="space-y-2">
        {stages.length ? (
          stages.map((stage) => (
            <div key={stage.stageName} className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-950">{humanStage(stage.stageName, language)}</div>
                <div className="mt-1 text-xs text-slate-500">
                  {t("batchDetail.currentStatus", { status: stageStatusText(stage.status, language) })}
                </div>
              </div>
              <button
                className="btn-secondary min-h-10 w-full gap-2 !rounded-xl !px-3 !py-2.5 !text-xs sm:w-auto"
                onClick={() => onSkip(stage)}
                type="button"
                disabled={loadingKey === `skip-${stage.stageName}`}
              >
                <SkipForward size={14} />
                {loadingKey === `skip-${stage.stageName}` ? t("batchDetail.savingSkip") : t("batchDetail.skipStage")}
              </button>
            </div>
          ))
        ) : (
          <EmptyState>{t("batchDetail.allOptionalDecided")}</EmptyState>
        )}
      </div>
    </Panel>
  );
}

function SkipStageModal({
  error,
  language,
  loading,
  onCancel,
  onConfirm,
  onReasonChange,
  reason,
  stage,
  t,
}) {
  if (!stage) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-3 backdrop-blur-sm sm:p-6">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-4 sm:px-5">
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-amber-200 bg-white text-amber-700">
              <AlertTriangle size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-slate-950">
                {t("batchDetail.skipWarningTitle", { stage: humanStage(stage.stageName, language) })}
              </h3>
              <p className="mt-1 text-sm leading-6 text-amber-900">
                {t("batchDetail.skipWarningDescription")}
              </p>
            </div>
          </div>
        </div>

        <form className="p-4 sm:p-5" onSubmit={onConfirm}>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            {t("batchDetail.skipReasonLabel")}
          </label>
          <textarea
            className="input min-h-32 !rounded-xl !px-3 !py-2.5"
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={t("batchDetail.skipReasonPlaceholder")}
            autoFocus
          />

          {error && (
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="btn-secondary w-full !rounded-xl !px-4 !py-2.5 sm:w-auto"
              onClick={onCancel}
              disabled={loading}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="btn-primary w-full gap-2 !rounded-xl !px-4 !py-2.5 sm:w-auto"
              disabled={loading}
            >
              <SkipForward size={15} />
              {loading ? t("batchDetail.savingSkip") : t("batchDetail.confirmSkip")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TraceSummaryPanel({ batch, blockchainAnchored, blockchainFinalization, finalTrace, t }) {
  return (
    <Panel title={t("batchDetail.summary")}>
      <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white text-sm">
        <div className="grid gap-1 px-3 py-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-3">
          <div className="font-medium text-slate-500">{t("batchDetail.finalTx")}</div>
          <div className="min-w-0 break-all font-semibold text-slate-900">{shortHash(blockchainFinalization?.txHash)}</div>
        </div>
        <div className="grid gap-1 px-3 py-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-3">
          <div className="font-medium text-slate-500">{t("batchDetail.finalJson")}</div>
          <div className="min-w-0 break-all text-xs font-semibold text-slate-900 sm:text-sm">{finalTrace?.ipfsCid || t("common.inactive")}</div>
        </div>
        <div className="grid gap-1 px-3 py-3 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-3">
          <div className="font-medium text-slate-500">{t("batchDetail.quickLinks")}</div>
          <div className="flex min-w-0 flex-wrap gap-2">
            {blockchainFinalization?.txUrl && (
              <a href={blockchainFinalization.txUrl} target="_blank" rel="noreferrer" className="btn-secondary gap-2 !rounded-xl !px-3 !py-2 !text-xs">
                <ExternalLink size={14} />
                {t("common.etherscan")}
              </a>
            )}
            {finalTrace?.ipfsUrl && (
              <a href={finalTrace.ipfsUrl} target="_blank" rel="noreferrer" className="btn-secondary gap-2 !rounded-xl !px-3 !py-2 !text-xs">
                <ExternalLink size={14} />
                {t("common.jsonPinata")}
              </a>
            )}
            <Link to={`/traceability?batch=${batch.id}`} className="btn-secondary gap-2 !rounded-xl !px-3 !py-2 !text-xs">
              <Link2 size={14} />
              {t("common.traceability")}
            </Link>
            {blockchainAnchored && (
              <Link to={getPublicTraceabilityPath(batch.id)} target="_blank" className="btn-secondary gap-2 !rounded-xl !px-3 !py-2 !text-xs">
                {t("common.public")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}

export default function BatchDetailPage() {
  const { id } = useParams();
  const { openSidebar } = useOutletContext();
  const { language, t } = useLanguage();
  const { addNotification } = useNotifications();
  const [batch, setBatch] = useState(null);
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState("");
  const [activeInputStage, setActiveInputStage] = useState("");
  const [skipStage, setSkipStage] = useState(null);
  const [skipReason, setSkipReason] = useState("");

  const loadBatch = async () => {
    const response = await api.get(`/batches/${id}`);
    setBatch(response.data);
  };

  useEffect(() => {
    loadBatch();
  }, [id]);

  const availableStages = useMemo(() => getActiveStages(batch), [batch]);
  const skippableStages = useMemo(() => getSkippableStages(batch), [batch]);
  const finalTrace = batch?.trace?.finalTrace;
  const blockchainFinalization = batch?.trace?.blockchainFinalization;
  const blockchainAnchored = blockchainFinalization?.status === "anchored" && Boolean(blockchainFinalization.txHash);

  const openSkipModal = (stage) => {
    setActionError("");
    setSkipReason("");
    setSkipStage(stage);
  };

  const closeSkipModal = () => {
    if (actionLoading) return;
    setActionError("");
    setSkipReason("");
    setSkipStage(null);
  };

  const handleSkip = async (event) => {
    event.preventDefault();
    if (!skipStage) return;

    const trimmedReason = skipReason.trim();
    if (!trimmedReason) {
      setActionError(t("batchDetail.skipReasonRequired"));
      return;
    }

    setActionError("");
    setActionLoading(`skip-${skipStage.stageName}`);
    try {
      await api.post(`/batches/${batch.id}/stages/${skipStage.stageName}/skip`, {
        reason: trimmedReason,
      });
      addNotification({
        title: t("notifications.stageSkippedTitle"),
        message: t("notifications.stageSkippedMessage", {
          batchCode: batch.batchCode,
          stage: humanStage(skipStage.stageName, language),
        }),
        to: `/batches/${batch.id}`,
        type: "warning",
      });
      setSkipStage(null);
      setSkipReason("");
      await loadBatch();
    } catch (error) {
      setActionError(getApiErrorMessage(error, language, t("batchDetail.skipStage")));
    } finally {
      setActionLoading("");
    }
  };

  const handleInlineStageSubmitted = async () => {
    setActiveInputStage("");
    await loadBatch();
  };

  if (!batch) {
    return <div className="p-10 text-sm text-slate-500">{t("batchDetail.loading")}</div>;
  }

  return (
    <div>
      <Topbar
        title={t("batchDetail.title", { batchCode: batch.batchCode })}
        onOpenMenu={openSidebar}
      />

      <main className="px-3 py-4 sm:px-5 lg:px-6 lg:py-6">
        <div className="mx-auto max-w-7xl space-y-4">
          <Link
            to="/batches"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-200/50 transition hover:bg-slate-50"
            title={t("common.back")}
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">{t("common.back")}</span>
          </Link>

          <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm shadow-slate-200/50 sm:p-5">
            <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <span className={`${statusClasses(batch.status)} w-fit shrink-0`}>
                    {statusText(batch.status, language)}
                  </span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    {humanTeaType(batch.teaType, language)}
                  </span>
                </div>
                <h1 className="mt-3 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                  {batch.batchCode}
                </h1>
                <p className="mt-1 break-words text-sm text-slate-500">
                  {batch.gardenBlock || "-"}
                </p>
              </div>

              <div className="grid min-w-0 gap-2 sm:grid-cols-3 xl:w-[560px]">
                <MetaItem label={t("batchDetail.harvestDate")} value={formatDate(batch.harvestDate || batch.createdAt, language)} />
                <MetaItem label={t("batchDetail.workflowMode")} value={humanWorkflowMode(language)} />
                <MetaItem label={t("batchDetail.activeStage")} value={availableStages.length ? availableStages.map((stage) => humanStage(stage.stageName, language)).join(", ") : t("common.none")} />
              </div>
            </div>

            <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4 sm:grid-cols-2 xl:grid-cols-3">
              <MetaItem label={t("batchDetail.finalCidSepolia")}>
                <span className="block truncate" title={blockchainFinalization?.txHash || ""}>
                  {blockchainFinalization?.txHash || "-"}
                </span>
              </MetaItem>
              <MetaItem label={t("common.network")} value={blockchainFinalization?.network || "sepolia"} />
              <MetaItem label={t("common.pinata")}>
                <span className="block truncate" title={finalTrace?.ipfsCid || ""}>
                  {finalTrace?.ipfsCid || t("common.inactive")}
                </span>
              </MetaItem>
            </div>
          </section>

          {actionError && !skipStage && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {actionError}
            </div>
          )}

          <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-4">
              <ProductionFlowGuide teaType={batch.teaType} />
              <ReadyStagesPanel
                activeStageName={activeInputStage}
                batch={batch}
                language={language}
                onSelectStage={(stageName) => setActiveInputStage((current) => (current === stageName ? "" : stageName))}
                onSubmitted={handleInlineStageSubmitted}
                stages={availableStages}
                t={t}
              />
              <SkippableStagesPanel
                stages={skippableStages}
                language={language}
                loadingKey={actionLoading}
                onSkip={openSkipModal}
                t={t}
              />
              <TraceabilityQrCode batch={batch} />
              <ManualBlockchainAnchor batch={batch} onRecorded={loadBatch} />
            </div>

            <aside className="min-w-0 space-y-4 xl:sticky xl:top-24 xl:self-start">
              <StageTimeline stages={batch.stages} />
              <TraceSummaryPanel
                batch={batch}
                blockchainAnchored={blockchainAnchored}
                blockchainFinalization={blockchainFinalization}
                finalTrace={finalTrace}
                t={t}
              />
            </aside>
          </div>
        </div>
      </main>

      <SkipStageModal
        error={actionError}
        language={language}
        loading={actionLoading === `skip-${skipStage?.stageName}`}
        onCancel={closeSkipModal}
        onConfirm={handleSkip}
        onReasonChange={setSkipReason}
        reason={skipReason}
        stage={skipStage}
        t={t}
      />
    </div>
  );
}
