import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useLanguage } from "../contexts/LanguageContext";

export function getPublicTraceabilityPath(batchId) {
  return `/trace/${encodeURIComponent(batchId || "")}`;
}

export function getPublicTraceabilityUrl(batchId) {
  if (!batchId) return "";
  const path = getPublicTraceabilityPath(batchId);

  if (typeof window === "undefined") {
    return path;
  }

  return new URL(path, window.location.origin).toString();
}

export default function TraceabilityQrCode({ batch, className = "" }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const publicUrl = useMemo(() => getPublicTraceabilityUrl(batch?.id), [batch?.id]);
  const blockchainFinalization = batch?.trace?.blockchainFinalization;
  const blockchainAnchored = blockchainFinalization?.status === "anchored" && Boolean(blockchainFinalization.txHash);

  const handleCopy = async () => {
    if (!publicUrl || !navigator.clipboard) return;
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  if (!batch?.id || !blockchainAnchored) {
    return null;
  }

  return (
    <section className={`min-w-0 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/50 sm:p-5 ${className}`}>
      <div className="mb-4 flex min-w-0 items-center gap-2">
        <QrCode size={16} className="shrink-0 text-slate-500" />
        <h3 className="truncate text-sm font-semibold text-slate-950">{t("qr.title")}</h3>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="mx-auto rounded-xl border border-slate-200 bg-white p-2 sm:mx-0">
          <QRCodeSVG
            value={publicUrl}
            size={132}
            level="M"
            includeMargin
            bgColor="#ffffff"
            fgColor="#0f172a"
          />
        </div>
        <div className="min-w-0 flex-1 text-xs text-slate-600">
          <div className="truncate font-semibold text-slate-900">{batch.batchCode}</div>
          <div className="mt-2 break-all rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">{publicUrl}</div>
          <div className="mt-3 grid gap-2 sm:flex sm:flex-wrap">
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full gap-2 !rounded-xl !px-3 !py-2.5 !text-xs sm:w-auto"
            >
              <ExternalLink size={14} />
              {t("common.openPublic")}
            </a>
            <button
              className="btn-secondary w-full gap-2 !rounded-xl !px-3 !py-2.5 !text-xs sm:w-auto"
              onClick={handleCopy}
              type="button"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? t("common.copied") : t("common.copyUrl")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
