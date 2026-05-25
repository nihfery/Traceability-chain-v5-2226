import dotenv from "dotenv";

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_EXPLORER = "https://sepolia.etherscan.io";

export const teaTraceabilityAbi = [
  {
    type: "event",
    name: "IpfsCidStored",
    anonymous: false,
    inputs: [
      { name: "ipfsCid", type: "string", indexed: false },
      { name: "timestamp", type: "uint256", indexed: false },
      { name: "actor", type: "address", indexed: true },
    ],
  },
  {
    type: "function",
    name: "storeIpfsCid",
    stateMutability: "nonpayable",
    inputs: [{ name: "ipfsCid", type: "string" }],
    outputs: [],
  },
  {
    type: "function",
    name: "getIpfsCidCount",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "getIpfsCid",
    stateMutability: "view",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "ipfsCid", type: "string" },
          { name: "timestamp", type: "uint256" },
          { name: "actor", type: "address" },
        ],
      },
    ],
  },
];

function refreshEnv() {
  const configuredContractAddress = process.env.CONTRACT_ADDRESS;
  const configuredViteContractAddress = process.env.VITE_CONTRACT_ADDRESS;
  const configuredExplorerUrl = process.env.BLOCK_EXPLORER_URL;

  dotenv.config({ override: true });

  if (configuredContractAddress) {
    process.env.CONTRACT_ADDRESS = configuredContractAddress;
  }

  if (configuredViteContractAddress) {
    process.env.VITE_CONTRACT_ADDRESS = configuredViteContractAddress;
  }

  if (configuredExplorerUrl) {
    process.env.BLOCK_EXPLORER_URL = configuredExplorerUrl;
  }
}

export function getExplorerBaseUrl() {
  return process.env.BLOCK_EXPLORER_URL || SEPOLIA_EXPLORER;
}

export function getTxUrl(txHash) {
  return txHash ? `${getExplorerBaseUrl()}/tx/${txHash}` : null;
}

export function getBlockchainStatus() {
  refreshEnv();
  const contractAddress = process.env.CONTRACT_ADDRESS || process.env.VITE_CONTRACT_ADDRESS || null;

  return {
    enabled: Boolean(contractAddress),
    network: "sepolia",
    chainId: SEPOLIA_CHAIN_ID,
    explorerBaseUrl: getExplorerBaseUrl(),
    contractAddress,
    transactionMode: "manual_metamask",
    privateKeyRequired: false,
    abi: teaTraceabilityAbi,
  };
}
