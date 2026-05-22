import { ConnectKitProvider } from "connectkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { defaultChain, wagmiConfig, walletProjectIdConfigured } from "./config";

export function Web3Provider({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          mode="light"
          options={{
            enforceSupportedChains: true,
            hideBalance: true,
            initialChainId: defaultChain.id,
            overlayBlur: 3,
            walletConnectCTA: walletProjectIdConfigured ? "modal" : "link",
          }}
        >
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
