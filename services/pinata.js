import crypto from "crypto";
import dotenv from "dotenv";

const DEFAULT_GATEWAY = "gateway.pinata.cloud";

function buildName(payload) {
  const batchCode = payload.batch?.batchCode || payload.batchCode || "batch";
  const documentType = payload.documentType || payload.stageName || "trace";
  const safeBatchCode = String(batchCode).replace(/[^a-z0-9-_]/gi, "-");
  const safeDocumentType = String(documentType).replace(/[^a-z0-9-_]/gi, "-");
  return `${safeBatchCode}-${safeDocumentType}-${Date.now()}.json`;
}

function buildPrettyJson(payload) {
  return `${JSON.stringify(payload, null, 2)}\n`;
}

function refreshEnv() {
  const configuredJwt = process.env.PINATA_JWT;
  const configuredGateway = process.env.PINATA_GATEWAY;

  dotenv.config({ override: true });

  if (configuredJwt) {
    process.env.PINATA_JWT = configuredJwt;
  }

  if (configuredGateway) {
    process.env.PINATA_GATEWAY = configuredGateway;
  }
}

function normalizeGateway(gateway) {
  return String(gateway || DEFAULT_GATEWAY)
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/g, "") || DEFAULT_GATEWAY;
}

function getPinataConfig() {
  refreshEnv();

  return {
    jwt: process.env.PINATA_JWT?.trim() || "",
    gateway: normalizeGateway(process.env.PINATA_GATEWAY),
  };
}

export function getPinataStatus() {
  const { jwt, gateway } = getPinataConfig();

  return {
    provider: "pinata",
    enabled: Boolean(jwt),
    mode: jwt ? "live" : "mock",
    gateway,
  };
}

export async function uploadJsonToIpfs(payload) {
  const { jwt, gateway } = getPinataConfig();
  const name = buildName(payload);
  const content = buildPrettyJson(payload);

  if (!jwt) {
    const fakeCid = `bafy${crypto
      .createHash("sha256")
      .update(content)
      .digest("hex")
      .slice(0, 40)}`;

    return {
      cid: fakeCid,
      url: `https://${gateway}/ipfs/${fakeCid}`,
      name,
      mock: true,
    };
  }

  const formData = new FormData();
  formData.append("file", new Blob([content], { type: "application/json" }), name);
  formData.append(
    "pinataMetadata",
    JSON.stringify({
      name,
      keyvalues: {
        documentType: payload.documentType || payload.eventType || "traceability_json",
        batchCode: payload.batch?.batchCode || payload.batchCode || "",
      },
    })
  );

  const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Pinata upload failed (${response.status}): ${errorText || response.statusText}`);
  }

  const data = await response.json();

  return {
    cid: data.IpfsHash,
    url: `https://${gateway}/ipfs/${data.IpfsHash}`,
    name,
    mock: false,
  };
}
