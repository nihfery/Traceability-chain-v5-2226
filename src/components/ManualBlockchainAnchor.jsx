import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Blocks, CheckCircle2, ExternalLink, Loader2, Wallet } from "lucide-react";
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { formatUnits } from "viem";
import api from "../services/api";
import { shortHash } from "../utils/formatters";
import { resolveContractAddress, teaTraceabilityAbi } from "../web3/contract";
import { anchorChain } from "../web3/config";
import { useLanguage } from "../contexts/LanguageContext";
import { useNotifications } from "../contexts/NotificationContext";
import { getApiErrorMessage, translateApiMessage } from "../utils/apiErrors";

function DataBlock({ label, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5">
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <div className="mt-1 break-all text-xs text-slate-500">{children}</div>
    </div>
  );
}

function toBigIntOrNull(value) {
  if (value === null || typeof value === "undefined") {
    return null;
  }

  try {
    const parsed = typeof value === "bigint" ? value : BigInt(String(value));
    return parsed >= 0n ? parsed : null;
  } catch {
    return null;
  }
}

function buildTransactionCost(receipt) {
  const gasUsed = toBigIntOrNull(receipt?.gasUsed);
  const effectiveGasPriceWei = toBigIntOrNull(receipt?.effectiveGasPrice);
  const gasFeeWei = gasUsed !== null && effectiveGasPriceWei !== null ? gasUsed * effectiveGasPriceWei : null;

  if (gasUsed === null && effectiveGasPriceWei === null && gasFeeWei === null) {
    return null;
  }

  return {
    gasUsed: gasUsed?.toString() || null,
    effectiveGasPriceWei: effectiveGasPriceWei?.toString() || null,
    gasFeeWei: gasFeeWei?.toString() || null,
    gasFeeEth: gasFeeWei !== null ? formatUnits(gasFeeWei, 18) : null,
    nativeCurrencySymbol: anchorChain.nativeCurrency?.symbol || "ETH",
    source: "wallet_receipt",
  };
}

export default function ManualBlockchainAnchor({ batch, onRecorded }) {
  const { language, t } = useLanguage();
  const { addNotification } = useNotifications();
  const [systemStatus, setSystemStatus] = useState(null);
  const [txHash, setTxHash] = useState("");
  const [recordedHash, setRecordedHash] = useState("");
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { writeContractAsync, isPending: isWriting } = useWriteContract();

  useEffect(() => {
    api
      .get("/system/web3-status")
      .then((response) => setSystemStatus(response.data))
      .catch(() => setSystemStatus(null));
  }, []);

  const finalTrace = batch?.trace?.finalTrace;
  const finalization = batch?.trace?.blockchainFinalization;
  const finalCid = finalTrace?.ipfsCid || finalization?.finalCid || "";
  const contractAddress = resolveContractAddress(systemStatus);
  const anchored = finalization?.status === "anchored";
  const stagesFinalized =
    Array.isArray(batch?.stages) &&
    batch.stages.length > 0 &&
    batch.stages.every((stage) => stage.status === "completed" || stage.status === "skipped");
  const txUrl = finalization?.txUrl || (txHash ? `${systemStatus?.blockchain?.explorerBaseUrl || "https://sepolia.etherscan.io"}/tx/${txHash}` : "");

  const disabledReason = useMemo(() => {
    if (!stagesFinalized) {
      return t("manualAnchor.batchIncomplete");
    }
    if (finalTrace?.status === "failed") {
      return translateApiMessage(finalTrace.errorMessage, language, t("manualAnchor.pinataFailed"));
    }
    if (finalTrace?.mock?.ipfs) {
      return t("manualAnchor.pinataMock");
    }
    if (!finalCid) {
      return t("manualAnchor.cidMissing");
    }
    if (!contractAddress) {
      return t("manualAnchor.contractMissing");
    }
    if (!isConnected) {
      return t("manualAnchor.walletMissing");
    }
    return "";
  }, [contractAddress, finalCid, finalTrace, isConnected, language, stagesFinalized, t]);

  const {
    data: receipt,
    error: receiptError,
    isError: receiptFailed,
    isSuccess: receiptSuccess,
  } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
    query: {
      enabled: Boolean(txHash),
    },
  });
  const waitingForReceipt = Boolean(txHash) && !receiptSuccess && !receiptFailed && !recordedHash;

  useEffect(() => {
    if (!receiptFailed) return;
    setError(receiptError?.shortMessage || receiptError?.message || t("manualAnchor.receiptFailed"));
  }, [receiptError, receiptFailed, t]);

  useEffect(() => {
    if (!receiptSuccess || !txHash || recordedHash === txHash || !batch?.id) {
      return;
    }

    let cancelled = false;
    setRecording(true);
    setError("");

    api
      .post(`/batches/${batch.id}/blockchain`, {
        txHash,
        walletAddress: address,
        chainId: anchorChain.id,
        transactionCost: buildTransactionCost(receipt),
      })
      .then(async () => {
        if (cancelled) return;
        setRecordedHash(txHash);
        addNotification({
          title: t("notifications.blockchainAnchoredTitle"),
          message: t("notifications.blockchainAnchoredMessage", {
            batchCode: batch.batchCode,
          }),
          to: `/batches/${batch.id}`,
          type: "success",
        });
        await onRecorded?.();
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getApiErrorMessage(err, language, t("manualAnchor.recordFailed")));
      })
      .finally(() => {
        if (!cancelled) {
          setRecording(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [addNotification, address, batch?.batchCode, batch?.id, language, onRecorded, receipt, receiptSuccess, recordedHash, t, txHash]);

  const handleAnchor = async () => {
    setError("");

    if (disabledReason) {
      setError(disabledReason);
      return;
    }

    try {
      if (chainId !== anchorChain.id) {
        await switchChainAsync({ chainId: anchorChain.id });
      }

      const hash = await writeContractAsync({
        address: contractAddress,
        abi: teaTraceabilityAbi,
        functionName: "storeIpfsCid",
        args: [finalCid],
        chainId: anchorChain.id,
      });

      setTxHash(hash);
      setRecordedHash("");
    } catch (err) {
      setError(err.shortMessage || err.message || t("manualAnchor.cancelled"));
    }
  };

  return (
    <section className="min-w-0 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm shadow-slate-200/50 sm:p-5">
      <div className="mb-4 flex min-w-0 items-center gap-2">
        <Blocks size={16} className="shrink-0 text-slate-500" />
        <h3 className="truncate text-sm font-semibold text-slate-950">{t("manualAnchor.title")}</h3>
      </div>

      <div className="space-y-2">
        <DataBlock label={t("manualAnchor.cid")}>
          {finalCid || "-"}
          {finalTrace?.ipfsUrl && (
            <a href={finalTrace.ipfsUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-sky-700">
              <ExternalLink size={13} />
              {t("common.openJson")}
            </a>
          )}
        </DataBlock>

        <DataBlock label={t("manualAnchor.status")}>
          {anchored ? finalization?.txHash : waitingForReceipt ? txHash : t("manualAnchor.waitingManual")}
          <div className="mt-2 text-slate-400">{t("common.contract")}: {contractAddress || "-"}</div>
          {txUrl && (
            <a href={txUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-sky-700">
              <ExternalLink size={13} />
              {shortHash(anchored ? finalization?.txHash : txHash)}
            </a>
          )}
        </DataBlock>
      </div>

      {anchored ? (
        <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <CheckCircle2 size={14} />
          {t("manualAnchor.anchored")}
        </div>
      ) : (
        <button
          className="btn-primary mt-4 w-full gap-2 !rounded-xl !px-3 !py-2.5 !text-xs"
          disabled={Boolean(disabledReason) || isWriting || isSwitching || recording || waitingForReceipt}
          onClick={handleAnchor}
          type="button"
        >
          {isWriting || isSwitching || recording || waitingForReceipt ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Wallet size={14} />
          )}
          {waitingForReceipt || recording ? t("manualAnchor.waiting") : t("manualAnchor.send")}
        </button>
      )}

      {(disabledReason || error) && !anchored && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{error || disabledReason}</span>
        </div>
      )}
    </section>
  );
}
