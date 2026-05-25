import { MIN_API_DOCS_PASSWORD_LENGTH, MIN_JWT_SECRET_LENGTH } from "./env.js";

const STAGE_FIELD_TEMPLATES = {
  plucking: {
    operatorShift: "",
    leafGrade: "",
    weightKg: "",
    location: "",
    notes: "",
  },
  withering: {
    durationMinutes: "",
    temperature: "",
    humidity: "",
    weightBeforeKg: "",
    weightAfterKg: "",
    notes: "",
  },
  rolling: {
    durationMinutes: "",
    machineCode: "",
    rpm: "",
    outputKg: "",
    notes: "",
  },
  predrying: {
    temperature: "",
    durationMinutes: "",
    moisturePercent: "",
    notes: "",
  },
  drying: {
    dryerMachine: "",
    temperature: "",
    durationMinutes: "",
    finalMoisturePercent: "",
    notes: "",
  },
  postdrying: {
    sortingGrade: "",
    qcStatus: "",
    aromaNote: "",
    notes: "",
  },
  packing: {
    packageType: "",
    totalPackage: "",
    netWeightKg: "",
    warehouseLocation: "",
    notes: "",
  },
};

const TEA_PRODUCTION_FLOWS = [
  {
    teaType: "Green Tea",
    stages: ["plucking", "withering", "rolling", "drying", "packing"],
    labels: ["Plucking", "Withering", "Rolling", "Drying", "Packing"],
  },
  {
    teaType: "Yellow Tea",
    stages: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
    labels: ["Plucking", "Withering", "Rolling", "Pre-Drying", "Drying", "Post-Drying", "Packing"],
  },
  {
    teaType: "White Tea",
    stages: ["plucking", "withering", "drying", "packing"],
    labels: ["Plucking", "Withering", "Drying", "Packing"],
  },
  {
    teaType: "Oolong Tea",
    stages: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
    labels: ["Plucking", "Withering", "Rolling", "Pre-Drying", "Drying", "Post-Drying", "Packing"],
  },
  {
    teaType: "Black Tea",
    stages: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
    labels: ["Plucking", "Withering", "Rolling", "Pre-Drying", "Drying", "Post-Drying", "Packing"],
  },
  {
    teaType: "Dark Tea",
    stages: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
    labels: ["Plucking", "Withering", "Rolling", "Pre-Drying", "Drying", "Post-Drying", "Packing"],
  },
];

const BATCH_MODEL = {
  id: "uuid",
  batchCode: "TEA-2026-0001",
  teaType: "Black Tea",
  gardenBlock: "Block A-07",
  harvestDate: "2026-05-21T08:00",
  notes: "Catatan awal batch",
  workflowMode: "dynamic-multi-path",
  status: "draft | in_progress | completed",
  createdAt: "2026-05-21T08:00:00.000Z",
  createdBy: "Admin Tea Factory",
  trace: {
    batchRegistration: {
      status: "stored_supabase",
      historyId: "uuid",
    },
    finalTrace: {
      status: "pending_ipfs | ipfs_stored | failed",
      ipfsCid: "Qm...",
      ipfsUrl: "https://gateway/ipfs/Qm...",
    },
    blockchainFinalization: {
      status: "awaiting_wallet_signature | anchored",
      finalCid: "Qm...",
      txHash: "0x...",
      txUrl: "https://sepolia.etherscan.io/tx/0x...",
    },
  },
  stages: [
    {
      stageName: "plucking",
      label: "Plucking",
      skippable: false,
      prerequisiteStages: [],
      status: "available | pending | completed | skipped",
      completed: false,
      skipped: false,
      skipReason: null,
      timestamp: null,
      operator: null,
      payload: null,
      historyId: null,
    },
  ],
};

const USER_MODEL = {
  id: "u-001",
  email: "admin@teh.local",
  name: "Admin Tea Factory",
  role: "admin | operator",
};

const NOTIFICATION_MODEL = {
  id: "uuid",
  userId: "u-001",
  userEmail: "admin@teh.local",
  title: "Tahap tersimpan",
  message: "Plucking untuk TEA-2026-0001 berhasil dicatat.",
  to: "/batches/<batch-id>",
  type: "info | success | warning | error",
  read: false,
  createdAt: "2026-05-25T08:00:00.000Z",
  updatedAt: "2026-05-25T08:00:00.000Z",
};

const HISTORY_MODEL = {
  id: "uuid",
  batchId: "uuid",
  batchCode: "TEA-2026-0001",
  stageName: "plucking | final_trace_json | null",
  eventType: "batch_created | stage_completed | stage_skipped | batch_final_trace_json | final_cid_anchored",
  action: "created | completed | skipped | final_json_created | manual_wallet_anchor",
  status: "stored_supabase | pending_ipfs | ipfs_stored | anchored | failed",
  operator: "Admin Tea Factory",
  reason: "Alasan skip bila ada",
  payload: {},
  data: {},
  ipfsCid: "Qm...",
  ipfsUrl: "https://gateway/ipfs/Qm...",
  txHash: "0x...",
  txUrl: "https://sepolia.etherscan.io/tx/0x...",
  network: "sepolia",
  chainId: 11155111,
  contractAddress: "0x...",
  errorMessage: null,
  recordedAt: "2026-05-25T08:00:00.000Z",
  createdAt: "2026-05-25T08:00:00.000Z",
};

const SYSTEM_STATUS_MODEL = {
  storage: {
    provider: "supabase",
    enabled: true,
    activeKeyType: "publishable | service_role",
    publishableKeyConfigured: true,
    serviceRoleConfigured: true,
    projectRef: "yunrneklsqjfoklmjeqm",
    url: "https://project.supabase.co",
  },
  blockchain: {
    enabled: true,
    network: "sepolia",
    chainId: 11155111,
    contractAddress: "0x...",
    transactionMode: "manual_metamask",
    explorerBaseUrl: "https://sepolia.etherscan.io",
  },
  ipfs: {
    enabled: true,
    mode: "pinata | mock",
    gateway: "gateway.pinata.cloud",
  },
};

const BASE_URLS = {
  development: "http://<ip-laptop>:5173/api atau port Vite yang aktif",
  production: "https://<domain-produksi>/api",
  vercel: "https://<vercel-project>.vercel.app/api",
};

const ENVIRONMENT_VARIABLES = [
  {
    name: "PORT",
    scope: "server lokal",
    required: "development",
    example: "5000",
    note: "Dipakai npm run api/dev:server/start. Vercel memakai port internal sendiri.",
  },
  {
    name: "SUPABASE_PROJECT_REF",
    scope: "server dan Supabase CLI",
    required: true,
    example: "your-project-ref",
    note: "Project ref Supabase. Jika SUPABASE_URL kosong, backend membentuk URL dari project ref ini.",
  },
  {
    name: "SUPABASE_URL",
    scope: "server",
    required: true,
    example: "https://your-project-ref.supabase.co",
    note: "URL project Supabase untuk API backend.",
  },
  {
    name: "SUPABASE_PUBLISHABLE_KEY",
    scope: "server",
    required: true,
    example: "sb_publishable_...",
    note: "Key Supabase untuk backend jika service role key tidak dipakai.",
  },
  {
    name: "SUPABASE_ACCESS_TOKEN",
    scope: "deploy/CLI",
    required: "opsional",
    example: "sbp_...",
    note: "Token CLI Supabase. Jangan expose ke browser.",
  },
  {
    name: "VITE_SUPABASE_URL",
    scope: "frontend compatibility",
    required: "opsional",
    example: "https://your-project-ref.supabase.co",
    note: "Disimpan untuk kompatibilitas env. Frontend saat ini memakai Express API melalui VITE_API_URL.",
  },
  {
    name: "VITE_SUPABASE_PUBLISHABLE_KEY",
    scope: "frontend compatibility",
    required: "opsional",
    example: "sb_publishable_...",
    note: "Disimpan untuk kompatibilitas env. Jangan isi service role key di variable VITE_*.",
  },
  {
    name: "VITE_API_URL",
    scope: "frontend",
    required: true,
    example: "/api",
    note: "Base URL axios. Gunakan /api untuk Vercel/static deployment yang sama domain.",
  },
  {
    name: "VITE_DEFAULT_CHAIN_ID",
    scope: "frontend wallet",
    required: true,
    example: "11155111",
    note: "Chain default modal wallet. Anchor final aplikasi tetap Sepolia.",
  },
  {
    name: "VITE_ALCHEMY_API_KEY",
    scope: "frontend wallet",
    required: "opsional",
    example: "alchemy_key",
    note: "Jika diisi, RPC wallet memakai Alchemy untuk chain yang didukung.",
  },
  {
    name: "VITE_WALLETCONNECT_PROJECT_ID",
    scope: "frontend wallet",
    required: "opsional",
    example: "walletconnect_project_id",
    note: "Diperlukan untuk QR/mobile WalletConnect. Browser wallet tetap bisa berjalan tanpa ini.",
  },
  {
    name: "VITE_CONTRACT_ADDRESS",
    scope: "frontend dan backend blockchain status",
    required: true,
    example: "0x...",
    note: "Alamat kontrak Sepolia dengan fungsi storeIpfsCid(string ipfsCid).",
  },
  {
    name: "JWT_SECRET",
    scope: "server auth",
    required: true,
    example: "minimal_32_random_chars",
    note: `Wajib minimal ${MIN_JWT_SECRET_LENGTH} karakter di production. Jangan pakai default development.`,
  },
  {
    name: "API_DOCS_PASSWORD",
    scope: "server docs fallback",
    required: true,
    example: "strong_docs_password",
    note: `Fallback password API Docs jika app_settings belum siap. Minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter di production.`,
  },
  {
    name: "PINATA_JWT",
    scope: "server IPFS",
    required: "opsional untuk mock, wajib untuk live Pinata",
    example: "pinata_jwt",
    note: "Jika kosong, backend membuat CID mock dan tidak cocok untuk finalisasi blockchain production.",
  },
  {
    name: "PINATA_GATEWAY",
    scope: "server IPFS",
    required: true,
    example: "your-gateway.mypinata.cloud",
    note: "Gateway publik untuk URL file JSON final.",
  },
  {
    name: "BLOCK_EXPLORER_URL",
    scope: "server blockchain",
    required: true,
    example: "https://sepolia.etherscan.io",
    note: "Base URL explorer untuk membentuk txUrl.",
  },
];

const PRODUCTION_CHECKLIST = [
  `JWT_SECRET terisi secret acak minimal ${MIN_JWT_SECRET_LENGTH} karakter.`,
  `API_DOCS_PASSWORD terisi password kuat minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter.`,
  "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY sudah sesuai project production.",
  "VITE_API_URL memakai /api jika frontend dan API berada di domain yang sama.",
  "VITE_CONTRACT_ADDRESS menunjuk kontrak Sepolia production aplikasi.",
  "PINATA_JWT dan PINATA_GATEWAY aktif jika CID final harus benar-benar tersimpan di Pinata.",
  "Migrasi Supabase sudah dipush, termasuk tabel users, batches, batch_history, app_settings, dan notifications.",
  "Endpoint GET /api/health mengembalikan { status: 'ok' } setelah deploy.",
];

export const API_DOCS = {
  title: "Tealabs API",
  version: "1.4.0",
  basePath: "/api",
  baseUrls: BASE_URLS,
  contentType: "application/json",
  docsPasswordOnly:
    `Password API Docs disimpan di tabel app_settings Supabase. Env API_DOCS_PASSWORD hanya fallback dan wajib minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter di production.`,
  mobileAccess:
    "Mobile app memakai endpoint yang sama dengan web. Endpoint public tidak butuh token, endpoint operasional batch memakai Bearer JWT dari login.",
  mobileBaseUrl:
    "Development: http://<IP-laptop>:5173/api atau port Vite yang aktif. Production: https://<domain-produksi>/api.",
  environmentVariables: ENVIRONMENT_VARIABLES,
  productionChecklist: PRODUCTION_CHECKLIST,
  security: {
    jwtSecretMinLength: MIN_JWT_SECRET_LENGTH,
    apiDocsPasswordMinLength: MIN_API_DOCS_PASSWORD_LENGTH,
    apiDocsPasswordHeader: "X-API-Docs-Password",
    apiDocsPasswordStorage: "Supabase app_settings.api_docs_password",
  },
  auth: {
    type: "Bearer JWT",
    header: "Authorization: Bearer <token>",
    tokenSource: "POST /api/auth/login",
    tokenExpiry: "8 jam",
    note: "Simpan token di secure storage mobile. Kirim header Authorization untuk endpoint dengan access Bearer JWT.",
  },
  mobileFlow: [
    {
      order: 1,
      title: "Login operator/admin",
      endpoint: "POST /api/auth/login",
      result: "Simpan token dan data user.",
    },
    {
      order: 2,
      title: "Ambil daftar batch",
      endpoint: "GET /api/batches",
      result: "Tampilkan list batch produksi dan statusnya.",
    },
    {
      order: 3,
      title: "Buat batch baru",
      endpoint: "POST /api/batches",
      result: "Backend membuat batch dengan stage awal plucking berstatus available.",
    },
    {
      order: 4,
      title: "Buka detail batch",
      endpoint: "GET /api/batches/:id",
      result: "Mobile membaca stages. Tombol input muncul untuk stage dengan status available.",
    },
    {
      order: 5,
      title: "Input tahap aktif",
      endpoint: "POST /api/batches/:id/stages/:stageName",
      result: "Backend menyimpan payload tahap, refresh stage berikutnya, dan mengembalikan batch terbaru.",
    },
    {
      order: 6,
      title: "Skip tahap opsional bila diperlukan",
      endpoint: "POST /api/batches/:id/stages/:stageName/skip",
      result: "Hanya rolling dan postdrying yang boleh di-skip. Backend refresh stage berikutnya.",
    },
    {
      order: 7,
      title: "Ulangi sampai semua tahap finalized",
      endpoint: "GET /api/batches/:id",
      result: "Jika semua tahap completed/skipped, backend membuat final JSON ke Pinata otomatis. Status batch tetap in_progress sampai CID final anchored ke blockchain.",
    },
    {
      order: 8,
      title: "Tampilkan traceability",
      endpoint: "GET /api/batches/:id/traceability atau GET /api/batches/public/:id/traceability",
      result: "Gunakan endpoint public untuk halaman QR/publik, endpoint internal untuk dashboard/mobile operator.",
    },
    {
      order: 9,
      title: "Simpan tx blockchain final jika mobile wallet dipakai",
      endpoint: "POST /api/batches/:id/blockchain",
      result: "Mobile mengirim txHash setelah transaksi wallet berhasil. Jika belum ada wallet mobile, finalisasi bisa tetap dari web.",
    },
    {
      order: 10,
      title: "Sinkron notifikasi user",
      endpoint: "GET /api/notifications",
      result: "Ambil notifikasi persistent dari Supabase, lalu gunakan endpoint PATCH/DELETE untuk status dibaca atau hapus.",
    },
    {
      order: 11,
      title: "Ubah password akun login",
      endpoint: "PUT /api/auth/me/password",
      result: "User mengirim password lama dan password baru. Setelah berhasil, login berikutnya memakai password baru.",
    },
  ],
  enums: {
    teaTypes: ["Green Tea", "Yellow Tea", "White Tea", "Oolong Tea", "Black Tea", "Dark Tea"],
    batchStatus: ["draft", "in_progress", "completed"],
    stageStatus: ["pending", "available", "completed", "skipped"],
    stageNames: ["plucking", "withering", "rolling", "predrying", "drying", "postdrying", "packing"],
    skippableStageNames: ["rolling", "postdrying"],
    workflowMode: ["dynamic-multi-path"],
    notificationTypes: ["info", "success", "warning", "error"],
    historyEventTypes: [
      "batch_created",
      "stage_completed",
      "stage_skipped",
      "batch_final_trace_json",
      "final_cid_anchored",
    ],
  },
  productionFlows: TEA_PRODUCTION_FLOWS,
  stageFieldTemplates: STAGE_FIELD_TEMPLATES,
  responseModels: {
    batch: BATCH_MODEL,
    user: USER_MODEL,
    notification: NOTIFICATION_MODEL,
    history: HISTORY_MODEL,
    systemStatus: SYSTEM_STATUS_MODEL,
    login: {
      token: "jwt-token",
      user: USER_MODEL,
    },
    passwordUpdate: {
      message: "Password berhasil diperbarui",
      user: USER_MODEL,
    },
    apiDocsPasswordUpdate: {
      message: "Password API Docs berhasil diperbarui",
      updatedAt: "2026-05-25T08:00:00.000Z",
      updatedBy: "admin@teh.local",
    },
    traceability: {
      batch: {
        id: "uuid",
        batchCode: "TEA-2026-0001",
        teaType: "Black Tea",
        status: "draft | in_progress | completed",
      },
      summary: {
        totalStagesShown: 7,
        completedStages: 3,
        hiddenSkippedStages: 0,
      },
      finalTrace: {
        status: "ipfs_stored",
        ipfsCid: "Qm...",
        ipfsUrl: "https://gateway/ipfs/Qm...",
      },
      blockchainFinalization: {
        status: "awaiting_wallet_signature | anchored",
        txHash: "0x...",
        txUrl: "https://sepolia.etherscan.io/tx/0x...",
      },
      stages: [
        {
          order: 1,
          stageName: "plucking",
          label: "Plucking",
          status: "completed",
          operator: "Admin Tea Factory",
          recordedAt: "2026-05-21T08:00:00.000Z",
          data: STAGE_FIELD_TEMPLATES.plucking,
        },
      ],
    },
  },
  commonErrors: [
    { status: 400, meaning: "Input tidak lengkap, stage belum available, atau tahap tidak boleh di-skip." },
    { status: 401, meaning: "Token tidak ada/salah, login gagal, atau password API Docs salah." },
    { status: 403, meaning: "Role user tidak cukup untuk aksi admin." },
    { status: 404, meaning: "Batch, traceability, atau endpoint tidak ditemukan." },
    { status: 500, meaning: "Kesalahan backend saat proses data." },
    { status: 503, meaning: "Koneksi, konfigurasi, atau schema Supabase belum siap." },
  ],
  groups: [
    {
      title: "Authentication",
      description: "Login user Supabase dan penerbitan JWT untuk web atau mobile app.",
      endpoints: [
        {
          method: "POST",
          path: "/api/auth/login",
          access: "Public",
          mobileUse: true,
          description: "Login memakai email dan password user Supabase.",
          body: {
            email: "user@example.com",
            password: "string",
          },
          success: {
            token: "jwt-token",
            user: {
              id: "u-001",
              email: "user@example.com",
              name: "Operator Name",
              role: "admin",
            },
          },
          errors: {
            400: "Email dan password wajib diisi",
            401: "Email atau password salah",
            503: "Login gagal karena koneksi atau konfigurasi Supabase bermasalah",
          },
        },
        {
          method: "PUT",
          path: "/api/auth/me/password",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description:
            "Mengubah password akun login user yang sedang aktif. Endpoint ini dipakai halaman My Profile.",
          body: {
            currentPassword: "password lama",
            newPassword: "password baru minimal 6 karakter",
          },
          success: "responseModels.passwordUpdate",
          errors: {
            400: "Password lama dan password baru wajib diisi / Password baru terlalu pendek / Password baru sama dengan password lama",
            401: "Token tidak valid atau password lama salah",
            404: "User tidak ditemukan",
            503: "Schema Supabase belum siap",
          },
        },
      ],
    },
    {
      title: "System",
      description: "Status integrasi backend, storage, IPFS, blockchain, dan dokumentasi.",
      endpoints: [
        {
          method: "GET",
          path: "/api/health",
          access: "Public",
          mobileUse: true,
          description: "Health check sederhana untuk memastikan API server merespons.",
          success: {
            status: "ok",
          },
        },
        {
          method: "GET",
          path: "/api/system/web3-status",
          access: "Public",
          mobileUse: true,
          description: "Melihat status Supabase, Pinata, dan konfigurasi blockchain.",
          success: "responseModels.systemStatus",
        },
        {
          method: "GET",
          path: "/api/system/api-docs",
          access: "Docs password",
          mobileUse: false,
          description: "Mengambil dokumentasi API untuk dashboard web. Mobile app tidak perlu memanggil endpoint ini.",
          headers: {
            "X-API-Docs-Password": "<API_DOCS_PASSWORD>",
          },
          success: "Seluruh object API_DOCS ini",
          errors: {
            401: "Password API Docs salah",
          },
        },
        {
          method: "PUT",
          path: "/api/system/api-docs/password",
          access: "Bearer JWT admin",
          mobileUse: false,
          description: "Mengubah password API Docs dan menyimpan hash password baru ke tabel app_settings Supabase.",
          headers: {
            Authorization: "Bearer <token admin>",
          },
          body: {
            currentPassword: "password API Docs lama",
            newPassword: `password API Docs baru minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter`,
          },
          success: "responseModels.apiDocsPasswordUpdate",
          errors: {
            400: `Password lama dan password baru wajib diisi / password baru minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter`,
            401: "Token tidak valid atau password lama salah",
            403: "User bukan admin",
            503: "Tabel app_settings belum siap",
          },
        },
      ],
    },
    {
      title: "Public Traceability",
      description: "Endpoint publik untuk QR/public traceability, bisa dipakai tanpa login.",
      endpoints: [
        {
          method: "GET",
          path: "/api/batches/public/:id/traceability",
          access: "Public",
          mobileUse: true,
          description: "Mengambil traceability publik batch. Tahap yang di-skip disembunyikan.",
          params: {
            id: "Batch UUID",
          },
          success: "responseModels.traceability",
          errors: {
            404: "Traceability tidak ditemukan",
          },
        },
      ],
    },
    {
      title: "Batches",
      description: "Endpoint batch produksi. Semua endpoint di grup ini butuh Bearer JWT.",
      endpoints: [
        {
          method: "GET",
          path: "/api/batches",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description: "Mengambil daftar batch produksi.",
          success: ["responseModels.batch"],
        },
        {
          method: "GET",
          path: "/api/batches/:id",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description:
            "Mengambil detail batch. Jika semua stage sudah completed/skipped, backend otomatis mencoba membuat final JSON Pinata. Batch baru completed setelah tx blockchain final tercatat.",
          params: {
            id: "Batch UUID",
          },
          success: "responseModels.batch",
          errors: {
            404: "Batch tidak ditemukan",
          },
        },
        {
          method: "POST",
          path: "/api/batches",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description: "Membuat batch produksi baru.",
          body: {
            batchCode: "TEA-2026-0001",
            teaType: "Black Tea",
            gardenBlock: "Block A-07",
            harvestDate: "2026-05-21T08:00",
            notes: "Catatan awal batch",
          },
          success: "responseModels.batch",
          errors: {
            400: "batchCode dan teaType wajib diisi / Kode batch sudah ada",
          },
        },
        {
          method: "POST",
          path: "/api/batches/:id/stages/:stageName",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description:
            "Menyimpan data tahap produksi yang sedang available. Pakai body sesuai stageFieldTemplates[stageName].",
          params: {
            id: "Batch UUID",
            stageName: "plucking | withering | rolling | predrying | drying | postdrying | packing",
          },
          body: {
            "...": "Gunakan template dari stageFieldTemplates sesuai stageName",
          },
          examples: {
            plucking: STAGE_FIELD_TEMPLATES.plucking,
            drying: STAGE_FIELD_TEMPLATES.drying,
          },
          success: "responseModels.batch",
          errors: {
            400: "Tahap belum tersedia untuk diproses",
            404: "Batch/tahap tidak ditemukan",
          },
        },
        {
          method: "POST",
          path: "/api/batches/:id/stages/:stageName/skip",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description:
            "Skip tahap opsional yang belum difinalisasi. Hanya stage dengan skippable true yang boleh di-skip.",
          params: {
            id: "Batch UUID",
            stageName: "rolling | postdrying",
          },
          body: {
            reason: "Keputusan skip dari awal proses",
          },
          success: "responseModels.batch",
          errors: {
            400: "Tahap sudah difinalisasi / Tahap ini tidak boleh di-skip",
            404: "Batch/tahap tidak ditemukan",
          },
        },
        {
          method: "POST",
          path: "/api/batches/:id/blockchain",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description:
            "Menyimpan tx hash final CID setelah transaksi wallet berhasil. Endpoint ini tidak mengirim transaksi blockchain; transaksi dilakukan dari wallet client. Setelah tersimpan, status batch menjadi completed.",
          params: {
            id: "Batch UUID",
          },
          body: {
            txHash: "0x...",
            walletAddress: "0x...",
            chainId: 11155111,
          },
          success: "responseModels.batch",
          errors: {
            400: "Tx hash wajib / CID final Pinata belum tersedia",
            404: "Batch tidak ditemukan",
          },
        },
        {
          method: "GET",
          path: "/api/batches/:id/history",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description: "Mengambil riwayat event batch dari Supabase.",
          params: {
            id: "Batch UUID",
          },
          success: ["responseModels.history"],
          errors: {
            404: "Batch tidak ditemukan",
          },
        },
        {
          method: "GET",
          path: "/api/batches/:id/traceability",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description: "Mengambil traceability internal batch. Tahap yang di-skip disembunyikan.",
          params: {
            id: "Batch UUID",
          },
          success: "responseModels.traceability",
          errors: {
            404: "Batch tidak ditemukan",
          },
        },
      ],
    },
    {
      title: "Notifications",
      description:
        "Notifikasi user disimpan persistent di Supabase. Semua endpoint di grup ini memakai user dari Bearer JWT.",
      endpoints: [
        {
          method: "GET",
          path: "/api/notifications",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description: "Mengambil daftar notifikasi user aktif, terbaru lebih dulu.",
          params: {
            limit: "Opsional, default 40, maksimal 100",
          },
          success: ["responseModels.notification"],
          errors: {
            503: "Tabel notifications Supabase belum siap",
          },
        },
        {
          method: "POST",
          path: "/api/notifications",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description:
            "Membuat notifikasi untuk user aktif. Web memakai endpoint ini setelah batch dibuat, tahap disimpan/skip, dan blockchain selesai.",
          body: {
            title: "Tahap tersimpan",
            message: "Plucking untuk TEA-2026-0001 berhasil dicatat.",
            to: "/batches/<batch-id>",
            type: "info | success | warning | error",
          },
          success: "responseModels.notification",
          errors: {
            400: "Judul notifikasi wajib diisi",
            503: "Tabel notifications Supabase belum siap",
          },
        },
        {
          method: "PATCH",
          path: "/api/notifications/read",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description: "Menandai semua notifikasi user aktif sebagai sudah dibaca.",
          success: {
            updated: 3,
          },
          errors: {
            503: "Tabel notifications Supabase belum siap",
          },
        },
        {
          method: "PATCH",
          path: "/api/notifications/:id/read",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description: "Menandai satu notifikasi sebagai sudah dibaca.",
          params: {
            id: "Notification UUID",
          },
          success: "responseModels.notification",
          errors: {
            404: "Notifikasi tidak ditemukan",
            503: "Tabel notifications Supabase belum siap",
          },
        },
        {
          method: "DELETE",
          path: "/api/notifications",
          access: "Bearer JWT",
          mobileUse: true,
          headers: {
            Authorization: "Bearer <token>",
          },
          description: "Menghapus semua notifikasi milik user aktif.",
          success: {
            ok: true,
          },
          errors: {
            503: "Tabel notifications Supabase belum siap",
          },
        },
      ],
    },
  ],
};
