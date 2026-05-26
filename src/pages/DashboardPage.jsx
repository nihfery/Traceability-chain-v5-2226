import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, ReceiptText, RefreshCw, ShieldCheck } from "lucide-react";
import { Link, useOutletContext } from "react-router-dom";
import { formatUnits } from "viem";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import BatchTable from "../components/BatchTable";
import api from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDate, shortHash } from "../utils/formatters";
import { getApiErrorMessage } from "../utils/apiErrors";

const MARKET_RATE_REFRESH_MS = 5 * 60 * 1000;

function toBigIntOrNull(value) {
  if (value === null || typeof value === "undefined") {
    return null;
  }

  const text = String(value).trim();
  if (!/^\d+$/.test(text)) {
    return null;
  }

  try {
    return BigInt(text);
  } catch {
    return null;
  }
}

function formatDecimalAmount(value, symbol, language) {
  const text = String(value ?? "").trim();
  if (!text) return "-";

  const numeric = Number(text);
  if (!Number.isFinite(numeric)) {
    return `${text} ${symbol}`;
  }

  if (numeric > 0 && numeric < 0.000001) {
    return `<0.000001 ${symbol}`;
  }

  const maximumFractionDigits = numeric >= 1 ? 4 : numeric >= 0.001 ? 6 : 8;
  const locale = language === "en" ? "en-US" : "id-ID";
  return `${new Intl.NumberFormat(locale, {
    maximumFractionDigits,
    minimumFractionDigits: 0,
  }).format(numeric)} ${symbol}`;
}

function formatInteger(value, language) {
  if (value === null || typeof value === "undefined" || value === "") {
    return "-";
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return value || "-";
  }

  return new Intl.NumberFormat(language === "en" ? "en-US" : "id-ID", {
    maximumFractionDigits: 0,
  }).format(numeric);
}

function formatWeiAmount(value, symbol, language) {
  const wei = toBigIntOrNull(value);
  return wei === null ? "-" : formatDecimalAmount(formatUnits(wei, 18), symbol, language);
}

function formatGasPrice(value, language) {
  const wei = toBigIntOrNull(value);
  return wei === null ? "-" : formatDecimalAmount(formatUnits(wei, 9), "Gwei", language);
}

function formatFiatAmount(value, currency, language) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return "";
  }

  const locale = language === "en" ? "en-US" : "id-ID";
  const isIdr = currency === "IDR";
  const maximumFractionDigits = isIdr ? 0 : numeric >= 1 ? 2 : 4;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits,
    minimumFractionDigits: isIdr ? 0 : 2,
  }).format(numeric);
}

function formatFiatConversion(gasFeeEth, marketRates, language) {
  const eth = Number(gasFeeEth);
  const ethUsd = Number(marketRates?.rates?.usd);
  const ethIdr = Number(marketRates?.rates?.idr);

  if (!Number.isFinite(eth) || !Number.isFinite(ethUsd) || !Number.isFinite(ethIdr)) {
    return "";
  }

  return `${formatFiatAmount(eth * ethUsd, "USD", language)} / ${formatFiatAmount(eth * ethIdr, "IDR", language)}`;
}

function CostMetric({ label, value }) {
  return (
    <div className="surface-muted rounded-2xl p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className="mt-2 break-words text-base font-bold text-slate-900">{value}</p>
    </div>
  );
}

function GasFeeAmount({ language, marketRates, transactionCost }) {
  const symbol = transactionCost?.nativeCurrencySymbol || "ETH";
  const gasFeeWei = toBigIntOrNull(transactionCost?.gasFeeWei);
  const ethValue = gasFeeWei !== null ? formatUnits(gasFeeWei, 18) : transactionCost?.gasFeeEth;
  const fiatText = formatFiatConversion(ethValue, marketRates, language);
  const ethText = gasFeeWei !== null
    ? formatWeiAmount(transactionCost.gasFeeWei, symbol, language)
    : formatDecimalAmount(transactionCost?.gasFeeEth, symbol, language);

  return (
    <p className="break-words text-sm font-bold text-slate-900">
      {ethText}
      {fiatText && (
        <span className="ml-2 text-xs font-medium text-slate-500">
          {fiatText}
        </span>
      )}
    </p>
  );
}

function TransactionCostOverview({ error, loading, marketRates, marketRatesError, onRefresh, overview, language, t }) {
  const items = overview.rows;
  const symbol = overview.rows.find((row) => row.transactionCost)?.transactionCost.nativeCurrencySymbol || "ETH";
  const totalFee = overview.totalFeeWei === null ? "-" : formatWeiAmount(overview.totalFeeWei.toString(), symbol, language);
  const averageFee = overview.averageFeeWei === null ? "-" : formatWeiAmount(overview.averageFeeWei.toString(), symbol, language);
  const totalFiat = overview.totalFeeWei === null
    ? ""
    : formatFiatConversion(formatUnits(overview.totalFeeWei, 18), marketRates, language);
  const averageFiat = overview.averageFeeWei === null
    ? ""
    : formatFiatConversion(formatUnits(overview.averageFeeWei, 18), marketRates, language);
  const statusMessage = error || marketRatesError || (!overview.etherscan?.enabled ? t("dashboard.etherscanMissing") : "");

  return (
    <div className="card overflow-hidden">
      <div className="flex min-w-0 flex-col gap-3 border-b border-[#e6dccd] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="inline-flex shrink-0 rounded-2xl bg-sky-50 p-2 text-sky-700">
            <ReceiptText size={18} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{t("dashboard.transactionCosts")}</h3>
        </div>
        <button
          className="btn-secondary w-fit gap-2 !rounded-xl !px-3 !py-2 !text-xs"
          disabled={loading}
          onClick={onRefresh}
          type="button"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          {t("dashboard.refreshEtherscan")}
        </button>
      </div>

      <div className="grid gap-3 px-4 py-4 sm:grid-cols-3 sm:px-5">
        <CostMetric
          label={t("dashboard.totalGasFee")}
          value={
            <>
              {totalFee}
              {totalFiat && <span className="ml-2 text-xs font-medium text-slate-500">{totalFiat}</span>}
            </>
          }
        />
        <CostMetric
          label={t("dashboard.averageGasFee")}
          value={
            <>
              {averageFee}
              {averageFiat && <span className="ml-2 text-xs font-medium text-slate-500">{averageFiat}</span>}
            </>
          }
        />
        <CostMetric label={t("dashboard.recordedGasFees")} value={`${overview.feeCount}/${overview.rows.length}`} />
      </div>

      {statusMessage && (
        <div className="mx-4 mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 sm:mx-5">
          {statusMessage}
        </div>
      )}

      <div className="divide-y divide-[#eee5d8] border-t border-[#eee5d8]">
        {items.map(({ id, batchCode, txHash, txUrl, anchoredAt, transactionCost, errorMessage }) => (
          <div key={id} className="grid gap-3 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)_auto] sm:items-center sm:px-5">
            <div className="min-w-0">
              <Link to={`/batches/${id}`} className="break-words font-semibold text-slate-900 hover:text-emerald-700">
                {batchCode}
              </Link>
              <p className="mt-1 text-xs text-slate-500">
                {anchoredAt ? formatDate(anchoredAt, language) : shortHash(txHash)}
              </p>
            </div>
            <div className="min-w-0">
              <GasFeeAmount language={language} marketRates={marketRates} transactionCost={transactionCost} />
              {transactionCost ? (
                <p className="mt-1 break-words text-xs text-slate-500">
                  {t("dashboard.gasUsed")}: {formatInteger(transactionCost.gasUsed, language)}
                  {" | "}
                  {t("dashboard.gasPrice")}: {formatGasPrice(transactionCost.effectiveGasPriceWei, language)}
                </p>
              ) : (
                <p className="mt-1 break-words text-xs text-slate-500">{t("dashboard.gasFeeUnavailable")}</p>
              )}
              {errorMessage && (
                <p className="mt-2 break-words text-xs font-medium text-amber-700">{errorMessage}</p>
              )}
            </div>
            {txUrl && (
              <a href={txUrl} target="_blank" rel="noreferrer" className="btn-secondary w-fit gap-2 !rounded-xl !px-3 !py-2 !text-xs">
                <ExternalLink size={13} />
                {t("dashboard.viewTx")}
              </a>
            )}
          </div>
        ))}

        {!items.length && (
          <div className="px-5 py-8 text-center text-sm text-slate-500">
            {loading ? t("common.loading") : t("dashboard.noTransactionCosts")}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { openSidebar } = useOutletContext();
  const { language, t } = useLanguage();
  const [batches, setBatches] = useState([]);
  const [gasFeeRows, setGasFeeRows] = useState([]);
  const [gasFeeStatus, setGasFeeStatus] = useState(null);
  const [gasFeeLoading, setGasFeeLoading] = useState(true);
  const [gasFeeError, setGasFeeError] = useState("");
  const [marketRates, setMarketRates] = useState(null);
  const [marketRatesError, setMarketRatesError] = useState("");
  const [systemStatus, setSystemStatus] = useState(null);

  const loadMarketRates = useCallback(async (refresh = false) => {
    try {
      const response = await api.get("/system/market-rates", {
        params: refresh ? { refresh: "true" } : undefined,
      });
      setMarketRates(response.data || null);
      setMarketRatesError("");
    } catch (error) {
      setMarketRatesError(getApiErrorMessage(error, language, t("dashboard.marketRateLoadFailed")));
    }
  }, [language, t]);

  const loadGasFees = useCallback(async (refresh = false) => {
    setGasFeeLoading(true);
    setGasFeeError("");

    try {
      const response = await api.get("/batches/completed-gas-fees", {
        params: refresh ? { refresh: "true" } : undefined,
      });
      setGasFeeRows(response.data?.rows || []);
      setGasFeeStatus(response.data?.etherscan || null);
    } catch (error) {
      setGasFeeError(getApiErrorMessage(error, language, t("dashboard.gasFeeLoadFailed")));
    } finally {
      setGasFeeLoading(false);
    }
  }, [language, t]);

  useEffect(() => {
    api.get("/batches").then((response) => setBatches(response.data));
    api.get("/system/web3-status").then((response) => setSystemStatus(response.data)).catch(() => setSystemStatus(null));
    loadMarketRates();
    loadGasFees();
  }, [loadGasFees, loadMarketRates]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      loadMarketRates(true);
    }, MARKET_RATE_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, [loadMarketRates]);

  const stats = useMemo(() => {
    const completed = batches.filter((batch) => batch.status === "completed").length;
    const progress = batches.filter((batch) => batch.status === "in_progress").length;
    return {
      total: batches.length,
      completed,
      progress,
      ipfsRecords: batches.reduce(
        (sum, batch) => sum + (batch.trace?.finalTrace?.ipfsCid ? 1 : 0),
        0
      ),
    };
  }, [batches]);

  const transactionCostOverview = useMemo(() => {
    const rows = [...gasFeeRows].sort((left, right) => new Date(right.anchoredAt || 0) - new Date(left.anchoredAt || 0));
    const fees = rows
      .map((row) => toBigIntOrNull(row.transactionCost?.gasFeeWei))
      .filter((fee) => fee !== null);
    const totalFeeWei = fees.length ? fees.reduce((sum, fee) => sum + fee, 0n) : null;

    return {
      rows,
      etherscan: gasFeeStatus,
      feeCount: fees.length,
      totalFeeWei,
      averageFeeWei: totalFeeWei === null ? null : totalFeeWei / BigInt(fees.length),
    };
  }, [gasFeeRows, gasFeeStatus]);

  return (
    <div>
      <Topbar
        title={t("dashboard.title")}
        onOpenMenu={openSidebar}
      />
      <div className="space-y-5 p-3 sm:p-4 lg:space-y-6 lg:p-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title={t("dashboard.totalBatch")} value={stats.total} tone="default" />
          <StatCard title={t("common.inProgress")} value={stats.progress} tone="amber" />
          <StatCard title={t("common.completed")} value={stats.completed} tone="green" />
          <StatCard title={t("dashboard.finalJson")} value={stats.ipfsRecords} tone="sky" />
        </div>

        <TransactionCostOverview
          error={gasFeeError}
          loading={gasFeeLoading}
          marketRates={marketRates}
          marketRatesError={marketRatesError}
          onRefresh={() => {
            loadGasFees(true);
            loadMarketRates(true);
          }}
          overview={transactionCostOverview}
          language={language}
          t={t}
        />

        <div className="grid gap-5 xl:grid-cols-[0.85fr_1.65fr] xl:gap-6">
          <div className="card p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-2xl bg-emerald-50 p-2 text-emerald-700">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t("dashboard.integrationStatus")}</h3>
            </div>
            <div className="mt-5 space-y-3">
              <div className="surface-muted rounded-[22px] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Pinata</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{systemStatus?.ipfs?.enabled ? t("common.active") : t("common.inactive")}</p>
              </div>
              <div className="surface-muted rounded-[22px] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Blockchain</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{systemStatus?.blockchain?.enabled ? t("dashboard.metamaskReady") : t("common.inactive")}</p>
              </div>
            </div>
          </div>

          <BatchTable batches={batches.slice(0, 8)} />
        </div>
      </div>
    </div>
  );
}
