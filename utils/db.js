import "dotenv/config";
import { randomUUID } from "crypto";
import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";

const DEFAULT_PROJECT_REF = "yunrneklsqjfoklmjeqm";
const BATCH_SELECT =
  "id,batch_code,tea_type,garden_block,harvest_date,notes,workflow_mode,status,created_at,created_by,trace,stages";
const HISTORY_SELECT =
  "id,batch_id,batch_code,stage_name,event_type,action,status,operator,reason,payload,data,ipfs_cid,ipfs_url,ipfs_name,tx_hash,tx_url,network,chain_id,contract_address,mock,error_message,recorded_at,created_at";
const APP_SETTING_SELECT = "key,value,updated_at,updated_by";
const NOTIFICATION_SELECT =
  "id,user_id,user_email,title,message,target_path,type,read,created_at,updated_at";

let cachedClient = null;
let cachedClientKey = null;

function getProjectRef() {
  return process.env.SUPABASE_PROJECT_REF || DEFAULT_PROJECT_REF;
}

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || `https://${getProjectRef()}.supabase.co`;
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
}

function getPublishableKey() {
  return (
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY
  );
}

function getConfig() {
  const url = getSupabaseUrl();
  const supabaseKey = getServiceRoleKey() || getPublishableKey();

  if (!url || !supabaseKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY atau SUPABASE_PUBLISHABLE_KEY wajib diisi sebelum memakai API."
    );
  }

  return {
    url: url.replace(/\/$/, ""),
    supabaseKey,
  };
}

function getSupabaseClient() {
  const { url, supabaseKey } = getConfig();
  const cacheKey = `${url}:${supabaseKey}`;

  if (!cachedClient || cachedClientKey !== cacheKey) {
    cachedClient = createClient(url, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      realtime: {
        transport: WebSocket,
      },
    });
    cachedClientKey = cacheKey;
  }

  return cachedClient;
}

function unwrapSupabaseResult(result, action) {
  if (result.error) {
    throw new Error(`Supabase ${action} gagal: ${result.error.message}`);
  }

  return result.data;
}

function toBatch(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    batchCode: row.batch_code,
    teaType: row.tea_type,
    gardenBlock: row.garden_block,
    harvestDate: row.harvest_date,
    notes: row.notes,
    workflowMode: row.workflow_mode,
    status: row.status,
    createdAt: row.created_at,
    createdBy: row.created_by,
    trace: row.trace || {},
    stages: row.stages || [],
  };
}

function toBatchRow(batch) {
  return {
    id: batch.id,
    batch_code: batch.batchCode,
    tea_type: batch.teaType,
    garden_block: batch.gardenBlock || null,
    harvest_date: batch.harvestDate || null,
    notes: batch.notes || null,
    workflow_mode: batch.workflowMode || "dynamic-multi-path",
    status: batch.status || "draft",
    created_at: batch.createdAt || new Date().toISOString(),
    created_by: batch.createdBy || null,
    trace: batch.trace || {},
    stages: batch.stages || [],
  };
}

function toUserRow(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
  };
}

function toAppSetting(row) {
  if (!row) {
    return null;
  }

  return {
    key: row.key,
    value: row.value,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
  };
}

function toNotification(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    userId: row.user_id,
    userEmail: row.user_email,
    title: row.title,
    message: row.message || "",
    to: row.target_path || "",
    type: row.type || "info",
    read: Boolean(row.read),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toNotificationRow(notification) {
  const row = {
    user_id: notification.userId,
    user_email: notification.userEmail || null,
    title: notification.title,
    message: notification.message || null,
    target_path: notification.to || notification.targetPath || null,
    type: notification.type || "info",
    read: Boolean(notification.read),
  };

  if (notification.id) row.id = notification.id;
  if (notification.createdAt) row.created_at = notification.createdAt;
  if (notification.updatedAt) row.updated_at = notification.updatedAt;

  return row;
}

function toHistory(row) {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    batchId: row.batch_id,
    batchCode: row.batch_code,
    stageName: row.stage_name,
    eventType: row.event_type,
    action: row.action,
    status: row.status,
    operator: row.operator,
    reason: row.reason,
    payload: row.payload,
    data: row.data,
    ipfsCid: row.ipfs_cid,
    ipfsUrl: row.ipfs_url,
    ipfsName: row.ipfs_name,
    txHash: row.tx_hash,
    txUrl: row.tx_url,
    network: row.network,
    chainId: row.chain_id,
    contractAddress: row.contract_address,
    mock: row.mock,
    errorMessage: row.error_message,
    recordedAt: row.recorded_at,
    createdAt: row.created_at,
  };
}

function toHistoryRow(entry) {
  return {
    id: entry.id || randomUUID(),
    batch_id: entry.batchId,
    batch_code: entry.batchCode,
    stage_name: entry.stageName || null,
    event_type: entry.eventType,
    action: entry.action,
    status: entry.status || "pending_external",
    operator: entry.operator || null,
    reason: entry.reason || null,
    payload: entry.payload || null,
    data: typeof entry.data === "undefined" ? null : entry.data,
    ipfs_cid: entry.ipfsCid || null,
    ipfs_url: entry.ipfsUrl || null,
    ipfs_name: entry.ipfsName || null,
    tx_hash: entry.txHash || null,
    tx_url: entry.txUrl || null,
    network: entry.network || null,
    chain_id: entry.chainId || null,
    contract_address: entry.contractAddress || null,
    mock: entry.mock || null,
    error_message: entry.errorMessage || null,
    recorded_at: entry.recordedAt || entry.timestamp || new Date().toISOString(),
  };
}

function toHistoryPatch(patch) {
  const row = {};

  if (patch.status) row.status = patch.status;
  if (patch.payload !== undefined) row.payload = patch.payload;
  if (patch.data !== undefined) row.data = patch.data;
  if (patch.ipfsCid !== undefined) row.ipfs_cid = patch.ipfsCid;
  if (patch.ipfsUrl !== undefined) row.ipfs_url = patch.ipfsUrl;
  if (patch.ipfsName !== undefined) row.ipfs_name = patch.ipfsName;
  if (patch.txHash !== undefined) row.tx_hash = patch.txHash;
  if (patch.txUrl !== undefined) row.tx_url = patch.txUrl;
  if (patch.network !== undefined) row.network = patch.network;
  if (patch.chainId !== undefined) row.chain_id = patch.chainId;
  if (patch.contractAddress !== undefined) row.contract_address = patch.contractAddress;
  if (patch.mock !== undefined) row.mock = patch.mock;
  if (patch.errorMessage !== undefined) row.error_message = patch.errorMessage;

  return row;
}

export function getStorageStatus() {
  const serviceRoleKey = getServiceRoleKey();
  const publishableKey = getPublishableKey();
  const activeKeyType = serviceRoleKey ? "service_role" : publishableKey ? "publishable" : null;

  return {
    provider: "supabase",
    enabled: Boolean(getSupabaseUrl() && (serviceRoleKey || publishableKey)),
    activeKeyType,
    publishableKeyConfigured: Boolean(publishableKey),
    serviceRoleConfigured: Boolean(serviceRoleKey),
    projectRef: getProjectRef(),
    url: getSupabaseUrl(),
  };
}

export async function findUserByCredentials(email, password) {
  const data = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("users")
      .select("id,name,email,role")
      .eq("email", email)
      .eq("password", password)
      .maybeSingle(),
    "login user"
  );

  return data || null;
}

export async function findUserWithPasswordById(id) {
  const data = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("users")
      .select("id,name,email,password,role")
      .eq("id", id)
      .maybeSingle(),
    "get user by id"
  );

  return data || null;
}

export async function updateUserPassword(id, password) {
  return unwrapSupabaseResult(
    await getSupabaseClient()
      .from("users")
      .update({ password })
      .eq("id", id)
      .select("id,name,email,role")
      .single(),
    "update user password"
  );
}

export async function upsertUser(user) {
  return unwrapSupabaseResult(
    await getSupabaseClient()
      .from("users")
      .upsert(toUserRow(user), { onConflict: "id" })
      .select("id,name,email,role")
      .single(),
    "upsert user"
  );
}

export async function getAppSetting(key) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient().from("app_settings").select(APP_SETTING_SELECT).eq("key", key).maybeSingle(),
    "get app setting"
  );

  return toAppSetting(row);
}

export async function upsertAppSetting(key, value, updatedBy = null) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("app_settings")
      .upsert(
        {
          key,
          value,
          updated_at: new Date().toISOString(),
          updated_by: updatedBy,
        },
        { onConflict: "key" }
      )
      .select(APP_SETTING_SELECT)
      .single(),
    "upsert app setting"
  );

  return toAppSetting(row);
}

export async function listNotifications(userId, limit = 40) {
  const cappedLimit = Math.min(Math.max(Number(limit) || 40, 1), 100);
  const rows = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("notifications")
      .select(NOTIFICATION_SELECT)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(cappedLimit),
    "list notifications"
  );

  return rows.map(toNotification);
}

export async function createNotification(notification) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("notifications")
      .insert(toNotificationRow(notification))
      .select(NOTIFICATION_SELECT)
      .single(),
    "insert notification"
  );

  return toNotification(row);
}

export async function markNotificationRead(userId, id) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("notifications")
      .update({
        read: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select(NOTIFICATION_SELECT)
      .maybeSingle(),
    "mark notification read"
  );

  return toNotification(row);
}

export async function markAllNotificationsRead(userId) {
  const rows = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("notifications")
      .update({
        read: true,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("read", false)
      .select(NOTIFICATION_SELECT),
    "mark all notifications read"
  );

  return rows.map(toNotification);
}

export async function clearNotifications(userId) {
  unwrapSupabaseResult(
    await getSupabaseClient().from("notifications").delete().eq("user_id", userId),
    "clear notifications"
  );
}

export async function listBatches() {
  const rows = unwrapSupabaseResult(
    await getSupabaseClient().from("batches").select(BATCH_SELECT).order("created_at", {
      ascending: false,
    }),
    "list batches"
  );
  return rows.map(toBatch);
}

export async function getBatchById(id) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient().from("batches").select(BATCH_SELECT).eq("id", id).maybeSingle(),
    "get batch"
  );
  return toBatch(row);
}

export async function getBatchByCode(batchCode) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("batches")
      .select(BATCH_SELECT)
      .eq("batch_code", batchCode)
      .maybeSingle(),
    "get batch by code"
  );
  return toBatch(row);
}

export async function insertBatch(batch) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient().from("batches").insert(toBatchRow(batch)).select(BATCH_SELECT).single(),
    "insert batch"
  );

  return toBatch(row);
}

export async function updateBatch(batch) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("batches")
      .update(toBatchRow(batch))
      .eq("id", batch.id)
      .select(BATCH_SELECT)
      .single(),
    "update batch"
  );

  return toBatch(row);
}

export async function upsertBatch(batch) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("batches")
      .upsert(toBatchRow(batch), { onConflict: "id" })
      .select(BATCH_SELECT)
      .single(),
    "upsert batch"
  );

  return toBatch(row);
}

export async function createHistoryEntry(entry) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("batch_history")
      .insert(toHistoryRow(entry))
      .select(HISTORY_SELECT)
      .single(),
    "insert batch history"
  );

  return toHistory(row);
}

export async function updateHistoryEntry(id, patch) {
  const row = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("batch_history")
      .update(toHistoryPatch(patch))
      .eq("id", id)
      .select(HISTORY_SELECT)
      .single(),
    "update batch history"
  );

  return toHistory(row);
}

export async function listBatchHistory(batchId) {
  const rows = unwrapSupabaseResult(
    await getSupabaseClient()
      .from("batch_history")
      .select(HISTORY_SELECT)
      .eq("batch_id", batchId)
      .order("recorded_at", { ascending: true }),
    "list batch history"
  );
  return rows.map(toHistory);
}
