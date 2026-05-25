import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { humanStage, humanTeaType } from "../utils/formatters";
import { getTeaStageGuide } from "../utils/teaFlows";

function StageRoute({ language, stages }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
      <div className="inline-flex min-w-max items-center gap-1.5">
        {stages.map((stage, index) => (
          <Fragment key={`${stage}-${index}`}>
            <div className="inline-flex h-8 items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs font-semibold text-slate-700">
              <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-slate-900 text-[9px] font-bold text-white">
                {index + 1}
              </span>
              <span>{humanStage(stage, language)}</span>
            </div>
            {index < stages.length - 1 && (
              <ChevronRight size={14} className="shrink-0 text-slate-400" />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default function ProductionFlowGuide({ teaType }) {
  const { language, t } = useLanguage();
  const selectedGuide = getTeaStageGuide(teaType);

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/50 sm:p-5">
      <div className="mb-4 min-w-0">
        <h2 className="truncate text-sm font-semibold text-slate-950">{t("batchDetail.workflowGuide")}</h2>
        <div className="mt-1 truncate text-xs font-medium text-slate-500">{humanTeaType(selectedGuide.teaType, language)}</div>
      </div>
      <StageRoute language={language} stages={selectedGuide.stages} />
    </section>
  );
}
