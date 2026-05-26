const COINGECKO_SIMPLE_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price";
const RATE_CACHE_MS = 60_000;

let cachedRates = null;
let cachedAt = 0;

function normalizePositiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? number : null;
}

export async function getEthMarketRates(options = {}) {
  const now = Date.now();

  if (!options.refresh && cachedRates && now - cachedAt < RATE_CACHE_MS) {
    return cachedRates;
  }

  const url = new URL(COINGECKO_SIMPLE_PRICE_URL);
  url.searchParams.set("ids", "ethereum");
  url.searchParams.set("vs_currencies", "usd,idr");
  url.searchParams.set("include_last_updated_at", "true");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CoinGecko gagal merespons (${response.status}).`);
  }

  const payload = await response.json();
  const ethereum = payload?.ethereum || {};
  const ethUsd = normalizePositiveNumber(ethereum.usd);
  const ethIdr = normalizePositiveNumber(ethereum.idr);

  if (!ethUsd || !ethIdr) {
    throw new Error("CoinGecko tidak mengembalikan kurs ETH USD/IDR.");
  }

  cachedRates = {
    source: "coingecko",
    baseAsset: "ETH",
    rates: {
      usd: ethUsd,
      idr: ethIdr,
    },
    lastUpdatedAt: ethereum.last_updated_at
      ? new Date(Number(ethereum.last_updated_at) * 1000).toISOString()
      : new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
  };
  cachedAt = now;

  return cachedRates;
}
