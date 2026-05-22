import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, createStorage, http } from "wagmi";
import { sepolia } from "wagmi/chains";

const appName = "Tea Traceability Admin";
const configuredProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim() || "";
const projectId = configuredProjectId || "injected-wallet-only";
const sepoliaRpcUrl =
  import.meta.env.VITE_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
export const walletStorageKey = "tea-traceability-wallet";

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

export const walletProjectIdConfigured = Boolean(configuredProjectId);

const walletGroups = [
  {
    groupName: "Desktop Wallet",
    wallets: [injectedWallet],
  },
  ...(walletProjectIdConfigured
    ? [
        {
          groupName: "Mobile Wallet",
          wallets: [rainbowWallet, metaMaskWallet, walletConnectWallet],
        },
      ]
    : []),
];

export const wagmiConfig = createConfig({
  connectors: connectorsForWallets(walletGroups, {
    appName,
    projectId,
  }),
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(sepoliaRpcUrl),
  },
  storage: createStorage({
    key: walletStorageKey,
    storage: browserStorage,
  }),
  ssr: false,
});
