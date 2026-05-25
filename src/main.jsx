import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Web3Provider } from "./web3/Web3Provider";
import { installWalletConnectErrorHandler } from "./web3/walletErrors";

installWalletConnectErrorHandler();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Web3Provider>
      <App />
    </Web3Provider>
  </React.StrictMode>
);
