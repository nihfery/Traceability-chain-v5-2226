import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AlertTriangle, ChevronDown, LogOut, Wallet } from "lucide-react";
import { useState } from "react";
import { useAccount, useConfig, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { sepolia } from "wagmi/chains";
import { walletProjectIdConfigured, walletStorageKey } from "../web3/config";

const SESSION_STORAGE_PREFIXES = ["wc@", "walletconnect", "WALLETCONNECT_"];

function removeStorageKeys(storage, shouldRemove) {
  if (!storage) return;

  try {
    const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index)).filter(Boolean);
    keys.forEach((key) => {
      if (shouldRemove(key)) {
        storage.removeItem(key);
      }
    });
  } catch {
    // Some browsers can block storage access in private or strict modes.
  }
}

function clearWalletSessionStorage() {
  if (typeof window === "undefined") return;

  const shouldRemove = (key) =>
    key === "wagmi.store" ||
    key === "wagmi.recentConnectorId" ||
    key === "wagmi.injected.connected" ||
    key === `${walletStorageKey}.store` ||
    key === `${walletStorageKey}.recentConnectorId` ||
    key === `${walletStorageKey}.injected.connected` ||
    SESSION_STORAGE_PREFIXES.some((prefix) => key.startsWith(prefix));

  removeStorageKeys(window.localStorage, shouldRemove);
  removeStorageKeys(window.sessionStorage, shouldRemove);
}

async function forgetWalletConnection(config, connector) {
  try {
    await config.storage?.removeItem("store");
    await config.storage?.removeItem("recentConnectorId");
    await config.storage?.removeItem("injected.connected");

    if (connector?.id) {
      await config.storage?.setItem(`${connector.id}.disconnected`, true);
    }
  } catch (error) {
    console.warn("Failed to clear persisted wallet state", error);
  }

  clearWalletSessionStorage();
}

function formatAddress(address) {
  return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Wallet";
}

function DisconnectWalletButton() {
  const { connector } = useAccount();
  const config = useConfig();
  const { disconnectAsync, isPending } = useDisconnect();
  const [disconnecting, setDisconnecting] = useState(false);

  const handleDisconnect = async () => {
    if (disconnecting || isPending) return;

    setDisconnecting(true);
    try {
      if (connector) {
        await disconnectAsync({ connector });
      } else {
        await disconnectAsync();
      }
    } catch (error) {
      console.warn("Wallet disconnect failed, clearing local session anyway", error);
    } finally {
      await forgetWalletConnection(config, connector);
      setDisconnecting(false);
    }
  };

  return (
    <button
      aria-label="Disconnect wallet"
      className="wallet-chip"
      disabled={disconnecting || isPending}
      onClick={handleDisconnect}
      title="Disconnect wallet"
      type="button"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">{disconnecting || isPending ? "Disconnecting" : "Disconnect"}</span>
    </button>
  );
}

function InjectedWalletButton() {
  const { address, chain, chainId, connector, isConnected } = useAccount();
  const config = useConfig();
  const { connectAsync, connectors, isPending: isConnecting } = useConnect();
  const { disconnectAsync, isPending: isDisconnecting } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const [error, setError] = useState("");

  const injectedConnector =
    connectors.find((item) => item.id === "injected" || item.type === "injected") || connectors[0];
  const wrongNetwork = isConnected && chainId && chainId !== sepolia.id;

  const handleConnect = async () => {
    if (!injectedConnector || isConnecting) return;

    setError("");
    try {
      await connectAsync({ connector: injectedConnector });
    } catch (connectError) {
      setError(connectError.shortMessage || connectError.message || "Gagal connect wallet");
    }
  };

  const handleSwitchChain = async () => {
    if (!switchChainAsync || isSwitching) return;

    setError("");
    try {
      await switchChainAsync({ chainId: sepolia.id });
    } catch (switchError) {
      setError(switchError.shortMessage || switchError.message || "Gagal ganti network");
    }
  };

  const handleDisconnect = async () => {
    if (isDisconnecting) return;

    setError("");
    try {
      await disconnectAsync(connector ? { connector } : undefined);
    } catch (disconnectError) {
      console.warn("Wallet disconnect failed, clearing local session anyway", disconnectError);
    } finally {
      await forgetWalletConnection(config, connector);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex min-w-0 flex-col items-end gap-1">
        <button className="wallet-chip" disabled={isConnecting} onClick={handleConnect} type="button">
          <Wallet size={16} />
          <span className="hidden min-[380px]:inline">{isConnecting ? "Connecting" : "Connect Wallet"}</span>
          <span className="min-[380px]:hidden">Wallet</span>
        </button>
        {error && <span className="max-w-48 truncate text-xs text-rose-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col items-end gap-1">
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {wrongNetwork ? (
          <button
            className="wallet-chip wallet-chip-warning"
            disabled={isSwitching}
            onClick={handleSwitchChain}
            type="button"
          >
            <AlertTriangle size={16} />
            <span className="hidden sm:inline">{isSwitching ? "Switching" : "Wrong Network"}</span>
          </button>
        ) : (
          <button className="wallet-chip hidden sm:inline-flex" type="button">
            <Wallet size={15} />
            <span>{chain?.name || "Sepolia"}</span>
          </button>
        )}
        <button className="wallet-chip wallet-chip-strong" type="button">
          <Wallet size={16} />
          <span className="max-w-24 truncate sm:max-w-32">{formatAddress(address)}</span>
        </button>
        <button
          aria-label="Disconnect wallet"
          className="wallet-chip"
          disabled={isDisconnecting}
          onClick={handleDisconnect}
          title="Disconnect wallet"
          type="button"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">{isDisconnecting ? "Disconnecting" : "Disconnect"}</span>
        </button>
      </div>
      {error && <span className="max-w-48 truncate text-xs text-rose-600">{error}</span>}
    </div>
  );
}

function ConnectedWalletControls({ account, chain, openAccountModal, openChainModal }) {
  if (chain.unsupported) {
    return (
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <button className="wallet-chip wallet-chip-warning" onClick={openChainModal} type="button">
          <AlertTriangle size={16} />
          <span className="hidden sm:inline">Wrong Network</span>
        </button>
        <DisconnectWalletButton />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <button className="wallet-chip hidden sm:inline-flex" onClick={openChainModal} type="button">
        {chain.hasIcon && chain.iconUrl ? (
          <span className="inline-flex h-5 w-5 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-white">
            <img alt={chain.name ?? "Chain icon"} className="h-5 w-5" src={chain.iconUrl} />
          </span>
        ) : (
          <Wallet size={15} />
        )}
        <span>{chain.name}</span>
      </button>
      <button className="wallet-chip wallet-chip-strong" onClick={openAccountModal} type="button">
        <Wallet size={16} />
        <span className="max-w-24 truncate sm:max-w-32">{account.displayName}</span>
        <ChevronDown size={14} />
      </button>
      <DisconnectWalletButton />
    </div>
  );
}

export default function WalletConnectButton() {
  if (!walletProjectIdConfigured) {
    return <InjectedWalletButton />;
  }

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        authenticationStatus,
        mounted,
        openAccountModal,
        openChainModal,
        openConnectModal,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            className="min-w-0"
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {!connected ? (
              <button className="wallet-chip" onClick={openConnectModal} type="button">
                <Wallet size={16} />
                <span className="hidden min-[380px]:inline">Connect Wallet</span>
                <span className="min-[380px]:hidden">Wallet</span>
              </button>
            ) : (
              <ConnectedWalletControls
                account={account}
                chain={chain}
                openAccountModal={openAccountModal}
                openChainModal={openChainModal}
              />
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
