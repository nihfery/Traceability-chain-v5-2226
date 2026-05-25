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

export function resolveContractAddress(systemStatus) {
  return (
    systemStatus?.blockchain?.contractAddress ||
    import.meta.env.VITE_CONTRACT_ADDRESS ||
    ""
  );
}
