let installed = false;

function getErrorMessage(error) {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (typeof error.message === "string") return error.message;
  if (typeof error.reason === "string") return error.reason;
  if (error.reason) return getErrorMessage(error.reason);
  return "";
}

export function isWalletConnectProposalExpired(error) {
  return getErrorMessage(error).toLowerCase().includes("proposal expired");
}

export function clearExpiredWalletConnectProposal() {
  if (typeof window === "undefined") return;

  const stores = [];
  try {
    if (window.localStorage) stores.push(window.localStorage);
  } catch {
    // Ignore blocked storage access.
  }
  try {
    if (window.sessionStorage) stores.push(window.sessionStorage);
  } catch {
    // Ignore blocked storage access.
  }

  const staleParts = ["proposal", "pairing", "history", "expirer"];

  stores.forEach((storage) => {
    try {
      Object.keys(storage).forEach((key) => {
        const normalized = key.toLowerCase();
        const walletConnectKey =
          normalized.startsWith("wc@2:") ||
          normalized.startsWith("walletconnect") ||
          normalized.includes("walletconnect");
        const staleProposalKey = staleParts.some((part) => normalized.includes(part));

        if (walletConnectKey && staleProposalKey) {
          storage.removeItem(key);
        }
      });
    } catch {
      // Ignore blocked storage access.
    }
  });
}

export function handleWalletConnectError(error) {
  if (!isWalletConnectProposalExpired(error)) {
    return false;
  }

  clearExpiredWalletConnectProposal();
  return true;
}

export function installWalletConnectErrorHandler() {
  if (installed || typeof window === "undefined") return;
  installed = true;

  window.addEventListener("unhandledrejection", (event) => {
    if (handleWalletConnectError(event.reason)) {
      event.preventDefault();
    }
  });

  window.addEventListener("error", (event) => {
    if (handleWalletConnectError(event.error || event.message)) {
      event.preventDefault();
    }
  });
}
