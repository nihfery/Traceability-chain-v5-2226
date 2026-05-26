const ETHERSCAN_API_URL = "https://api.etherscan.io/v2/api";
const DEFAULT_NATIVE_SYMBOL = "ETH";

function getApiKey() {
  return process.env.ETHERSCAN_API_KEY || process.env.ETHERSCAN_TOKEN || "";
}

function parseHexQuantity(value) {
  if (typeof value !== "string" || !value.startsWith("0x")) {
    return null;
  }

  try {
    return BigInt(value);
  } catch {
    return null;
  }
}

function formatWeiToEthString(wei) {
  const weiPerEth = 10n ** 18n;
  const whole = wei / weiPerEth;
  const fraction = wei % weiPerEth;
  const fractionText = fraction.toString().padStart(18, "0").replace(/0+$/, "");
  return fractionText ? `${whole}.${fractionText}` : whole.toString();
}

function normalizeTxHash(txHash) {
  const cleanTxHash = typeof txHash === "string" ? txHash.trim() : "";
  return /^0x[a-fA-F0-9]{64}$/.test(cleanTxHash) ? cleanTxHash : "";
}

export function getEtherscanStatus() {
  const apiKey = getApiKey();

  return {
    enabled: Boolean(apiKey),
    apiVersion: "v2",
    endpoint: ETHERSCAN_API_URL,
    keyConfigured: Boolean(apiKey),
  };
}

export async function fetchTransactionCostFromEtherscan(txHash, options = {}) {
  const cleanTxHash = normalizeTxHash(txHash);

  if (!cleanTxHash) {
    throw new Error("Tx hash tidak valid untuk query Etherscan.");
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("ETHERSCAN_API_KEY belum dikonfigurasi.");
  }

  const chainId = String(options.chainId || 11155111);
  const url = new URL(ETHERSCAN_API_URL);
  url.searchParams.set("chainid", chainId);
  url.searchParams.set("module", "proxy");
  url.searchParams.set("action", "eth_getTransactionReceipt");
  url.searchParams.set("txhash", cleanTxHash);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Etherscan gagal merespons (${response.status}).`);
  }

  const payload = await response.json();
  const receipt = payload?.result;

  if (!receipt || typeof receipt !== "object") {
    throw new Error(
      (typeof payload?.result === "string" && payload.result) ||
        payload?.message ||
        "Receipt transaksi belum tersedia dari Etherscan."
    );
  }

  const gasUsed = parseHexQuantity(receipt.gasUsed);
  const effectiveGasPriceWei = parseHexQuantity(receipt.effectiveGasPrice || receipt.gasPrice);

  if (gasUsed === null || effectiveGasPriceWei === null) {
    throw new Error("Receipt Etherscan tidak memuat gasUsed/effectiveGasPrice.");
  }

  const gasFeeWei = gasUsed * effectiveGasPriceWei;

  return {
    gasUsed: gasUsed.toString(),
    effectiveGasPriceWei: effectiveGasPriceWei.toString(),
    gasFeeWei: gasFeeWei.toString(),
    gasFeeEth: formatWeiToEthString(gasFeeWei),
    nativeCurrencySymbol: options.nativeCurrencySymbol || DEFAULT_NATIVE_SYMBOL,
    source: "etherscan",
    fetchedAt: new Date().toISOString(),
    chainId: Number(chainId),
    blockNumber: parseHexQuantity(receipt.blockNumber)?.toString() || null,
    receiptStatus: receipt.status || null,
  };
}
