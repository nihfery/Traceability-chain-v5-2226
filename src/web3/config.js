import { getDefaultConfig } from "connectkit";
import { createConfig, createStorage, http } from "wagmi";
import { arbitrum, base, mainnet, optimism, polygon, sepolia } from "wagmi/chains";

const appName = "Tea Traceability Admin";
const configuredProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim() || "";
const alchemyApiKey = import.meta.env.VITE_ALCHEMY_API_KEY?.trim() || "";
const ignoredProjectIds = new Set(["", "your_project_id", "injected-wallet-only"]);
export const walletStorageKey = "tea-traceability-wallet";
export const supportedChains = [sepolia, mainnet, polygon, base, arbitrum, optimism];
export const anchorChain = sepolia;
export const defaultChain =
  supportedChains.find((chain) => chain.id === Number(import.meta.env.VITE_DEFAULT_CHAIN_ID)) ||
  anchorChain;

const alchemyNetworks = {
  [sepolia.id]: "eth-sepolia",
  [mainnet.id]: "eth-mainnet",
  [polygon.id]: "polygon-mainnet",
  [base.id]: "base-mainnet",
  [arbitrum.id]: "arb-mainnet",
  [optimism.id]: "opt-mainnet",
};

function getAlchemyRpcUrl(chainId) {
  const network = alchemyNetworks[chainId];
  return alchemyApiKey && network ? `https://${network}.g.alchemy.com/v2/${alchemyApiKey}` : "";
}

const rpcUrls = {
  [sepolia.id]:
    import.meta.env.VITE_SEPOLIA_RPC_URL?.trim() ||
    getAlchemyRpcUrl(sepolia.id) ||
    "https://ethereum-sepolia-rpc.publicnode.com",
  [mainnet.id]: import.meta.env.VITE_MAINNET_RPC_URL?.trim() || getAlchemyRpcUrl(mainnet.id),
  [polygon.id]: import.meta.env.VITE_POLYGON_RPC_URL?.trim() || getAlchemyRpcUrl(polygon.id),
  [base.id]: import.meta.env.VITE_BASE_RPC_URL?.trim() || getAlchemyRpcUrl(base.id),
  [arbitrum.id]: import.meta.env.VITE_ARBITRUM_RPC_URL?.trim() || getAlchemyRpcUrl(arbitrum.id),
  [optimism.id]: import.meta.env.VITE_OPTIMISM_RPC_URL?.trim() || getAlchemyRpcUrl(optimism.id),
};

const appUrl = typeof window === "undefined" ? "https://localhost" : window.location.origin;

const browserStorage =
  typeof window === "undefined"
    ? undefined
    : {
        getItem: (key) => {
          try {
            return window.localStorage.getItem(key);
          } catch {
            return null;
          }
        },
        removeItem: (key) => {
          try {
            window.localStorage.removeItem(key);
          } catch {
            // Ignore blocked storage access.
          }
        },
        setItem: (key, value) => {
          try {
            window.localStorage.setItem(key, value);
          } catch {
            // Ignore blocked storage access.
          }
        },
      };

export const walletProjectIdConfigured = Boolean(configuredProjectId) && !ignoredProjectIds.has(configuredProjectId);

export const wagmiConfig = createConfig({
  ...getDefaultConfig({
    appName,
    appDescription: "Tea traceability blockchain anchoring",
    appUrl,
    chains: supportedChains,
    coinbaseWalletPreference: "all",
    enableAaveAccount: false,
    storage: createStorage({
      key: walletStorageKey,
      storage: browserStorage,
    }),
    transports: Object.fromEntries(
      supportedChains.map((chain) => [chain.id, http(rpcUrls[chain.id] || undefined)])
    ),
    walletConnectProjectId: walletProjectIdConfigured ? configuredProjectId : "",
  }),
  ssr: false,
});
