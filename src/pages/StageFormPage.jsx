import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import StageInputForm from "../components/StageInputForm";
import { humanStage } from "../utils/formatters";
import { useLanguage } from "../contexts/LanguageContext";

export default function StageFormPage() {
  const { id, stageName } = useParams();
  const { openSidebar } = useOutletContext();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div>
      <Topbar
        title={t("stageForm.title", { stage: humanStage(stageName, language) })}
        onOpenMenu={openSidebar}
        showCreate={false}
      />
      <div className="p-3 sm:p-4 lg:p-8">
        <StageInputForm
          batchId={id}
          stageName={stageName}
          className="mx-auto max-w-4xl bg-white/90 p-4 shadow-sm shadow-slate-200/50 sm:p-6 lg:p-8"
          onCancel={() => navigate(-1)}
          onSubmitted={() => navigate(`/batches/${id}`)}
        />
      </div>
    </div>
  );
}
