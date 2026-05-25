import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import StageTimeline from "../components/StageTimeline";
import TraceabilityQrCode from "../components/TraceabilityQrCode";
import api from "../services/api";
import { formatDate, humanTeaType, statusClasses, statusText } from "../utils/formatters";
import { useLanguage } from "../contexts/LanguageContext";

export default function TraceabilityPage() {
  const { openSidebar } = useOutletContext();
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const batchId = searchParams.get("batch");
  const [batch, setBatch] = useState(null);
  const [all, setAll] = useState([]);

  useEffect(() => {
    api.get("/batches").then((response) => setAll(response.data));
  }, []);

  const completedBatches = useMemo(
    () => all.filter((item) => item.status === "completed"),
    [all]
  );

  useEffect(() => {
    let cancelled = false;

    if (!batchId) {
      setBatch(null);
      return () => {
        cancelled = true;
      };
    }

    if (!all.length) {
      return () => {
        cancelled = true;
      };
    }

    const selected = completedBatches.find((item) => item.id === batchId);
    if (!selected) {
      setBatch(null);
      return () => {
        cancelled = true;
      };
    }

    api.get(`/batches/${batchId}`).then((response) => {
      if (cancelled) return;
      setBatch(response.data?.status === "completed" ? response.data : null);
    });

    return () => {
      cancelled = true;
    };
  }, [all.length, batchId, completedBatches]);

  return (
    <div>
      <Topbar
        title={t("traceability.title")}
        onOpenMenu={openSidebar}
      />
      <div className="p-3 sm:p-4 lg:p-8">
        <div className="grid min-w-0 items-start gap-4 xl:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm shadow-slate-200/50 xl:sticky xl:top-24">
            <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
              <h3 className="text-sm font-semibold text-slate-950">{t("traceability.batchList")}</h3>
              <p className="mt-1 text-xs text-slate-500">{t("traceability.completedOnly")}</p>
            </div>

            <div className="max-h-[70vh] divide-y divide-slate-200 overflow-y-auto">
              {completedBatches.length ? (
                completedBatches.map((item) => (
                  <Link
                    key={item.id}
                    to={`/traceability?batch=${item.id}`}
                    className={`block px-4 py-3 text-sm transition sm:px-5 ${
                      item.id === batchId ? "bg-emerald-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex min-w-0 items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-slate-950">{item.batchCode}</div>
                        <div className="mt-1 truncate text-xs text-slate-500">{humanTeaType(item.teaType, language)}</div>
                      </div>
                      <span className={`${statusClasses(item.status)} shrink-0`}>
                        {statusText(item.status, language)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      {formatDate(item.harvestDate || item.createdAt, language)}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="px-4 py-8 text-sm text-slate-500 sm:px-5">
                  {t("traceability.noCompletedBatch")}
                </div>
              )}
            </div>
          </aside>

          <section className="min-w-0 space-y-4">
            {batch ? (
              <>
                <TraceabilityQrCode batch={batch} />
                <StageTimeline
                  stages={batch.stages}
                  hideSkipped
                />
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 text-center text-sm text-slate-500 shadow-sm shadow-slate-200/50 sm:p-10">
                {completedBatches.length ? t("traceability.pickBatch") : t("traceability.noCompletedBatch")}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
