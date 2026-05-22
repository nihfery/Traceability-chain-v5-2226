import { ConnectKitButton } from "connectkit";

export default function WalletConnectButton() {
  return <ConnectKitButton label="Connect Wallet" showBalance={false} showAvatar />;
}
