import { AlertTriangle, ChevronDown, Loader2, Wallet } from "lucide-react";
import { ConnectKitButton } from "connectkit";
import { handleWalletConnectError } from "../web3/walletErrors";
import { useLanguage } from "../contexts/LanguageContext";

export default function WalletConnectButton() {
  const { t } = useLanguage();

  return (
    <ConnectKitButton.Custom>
      {({ chain, isConnected, isConnecting, show, truncatedAddress, unsupported }) => {
        const isDisconnected = !isConnected && !isConnecting;
        const isUnsupported = isConnected && unsupported;
        const label = isConnecting
          ? t("wallet.connecting")
          : isDisconnected
            ? t("wallet.connect")
          : isUnsupported
            ? t("wallet.wrongNetwork")
            : truncatedAddress || chain?.name || t("wallet.wallet");

        const handleClick = () => {
          try {
            const result = show?.();
            if (result && typeof result.catch === "function") {
              result.catch((error) => {
                if (!handleWalletConnectError(error)) {
                  console.error(error);
                }
              });
            }
          } catch (error) {
            if (!handleWalletConnectError(error)) {
              console.error(error);
            }
          }
        };

        return (
          <button
            className={`wallet-chip h-11 w-full max-w-full gap-2 px-3 sm:w-auto ${
              isUnsupported ? "wallet-chip-warning" : isConnected ? "wallet-chip-strong" : ""
            } ${isDisconnected ? "wallet-chip-connect" : ""}`}
            onClick={handleClick}
            type="button"
          >
            {!isDisconnected && (
              isConnecting ? (
                <Loader2 size={16} className="shrink-0 animate-spin" />
              ) : isUnsupported ? (
                <AlertTriangle size={16} className="shrink-0" />
              ) : (
                <Wallet size={16} className="shrink-0" />
              )
            )}
            <span className="wallet-chip-label min-w-0 truncate">{label}</span>
            {!isDisconnected && <ChevronDown size={14} className="hidden shrink-0 text-slate-400 sm:block" />}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
}
