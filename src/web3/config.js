import { createConfig, createStorage, http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";

const appName = "Tea Traceability Admin";
const configuredProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID?.trim() || "";
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

const walletMetadata = {
  name: appName,
  description: "Tea traceability blockchain anchoring",
  url: typeof window === "undefined" ? "https://localhost" : window.location.origin,
  icons: [],
};

const connectors = walletProjectIdConfigured
  ? [
      injected({ shimDisconnect: true }),
      metaMask({ dappMetadata: walletMetadata }),
      walletConnect({
        projectId: configuredProjectId,
        metadata: walletMetadata,
        showQrModal: true,
      }),
    ]
  : [injected({ shimDisconnect: true })];

export const wagmiConfig = createConfig({
  connectors,
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
