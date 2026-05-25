import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Plus } from "lucide-react";
import Topbar from "../components/Topbar";
import BatchTable from "../components/BatchTable";
import api from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";

export default function BatchesPage() {
  const { openSidebar } = useOutletContext();
  const { t } = useLanguage();
  const [batches, setBatches] = useState([]);

  useEffect(() => {
    api.get("/batches").then((response) => setBatches(response.data));
  }, []);

  return (
    <div>
      <Topbar
        title={t("batches.title")}
        onOpenMenu={openSidebar}
      />
      <div className="p-3 sm:p-4 lg:p-8">
        <BatchTable
          batches={batches}
          action={
            <Link to="/batches/new" className="btn-primary min-h-11 w-full gap-2 !rounded-xl px-4 shadow-sm sm:w-auto">
              <Plus size={16} />
              <span className="truncate">{t("topbar.newBatch")}</span>
            </Link>
          }
        />
      </div>
    </div>
  );
}
