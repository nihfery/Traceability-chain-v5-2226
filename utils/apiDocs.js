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
      transactionCost: {
        gasUsed: "123456",
        effectiveGasPriceWei: "1200000000",
        gasFeeWei: "148147200000000",
        gasFeeEth: "0.0001481472",
        nativeCurrencySymbol: "ETH",
        source: "etherscan",
        fetchedAt: "2026-05-26T12:00:00.000Z",
      },
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
  {
    name: "ETHERSCAN_API_KEY",
    scope: "server blockchain",
    required: "wajib untuk gas fee dashboard",
    example: "etherscan_api_key",
    note: "Dipakai backend untuk membaca receipt tx final dari Etherscan API V2 dan menghitung gas fee batch completed.",
  },
];

const PRODUCTION_CHECKLIST = [
  `JWT_SECRET terisi secret acak minimal ${MIN_JWT_SECRET_LENGTH} karakter.`,
  `API_DOCS_PASSWORD terisi password kuat minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter.`,
  "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY sudah sesuai project production.",
  "VITE_API_URL memakai /api jika frontend dan API berada di domain yang sama.",
  "VITE_CONTRACT_ADDRESS menunjuk kontrak Sepolia production aplikasi.",
  "PINATA_JWT dan PINATA_GATEWAY aktif jika CID final harus benar-benar tersimpan di Pinata.",
  "ETHERSCAN_API_KEY aktif agar dashboard bisa menampilkan gas fee tx blockchain batch completed.",
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
        transactionCost: {
          gasUsed: "123456",
          effectiveGasPriceWei: "1200000000",
          gasFeeWei: "148147200000000",
          gasFeeEth: "0.0001481472",
          nativeCurrencySymbol: "ETH",
          source: "etherscan",
          fetchedAt: "2026-05-26T12:00:00.000Z",
        },
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
          path: "/api/system/market-rates",
          access: "Public",
          mobileUse: false,
          description: "Mengambil kurs ETH ke USD dan IDR dari CoinGecko untuk konversi gas fee dashboard.",
          query: {
            refresh: "true untuk memaksa ambil ulang dari CoinGecko, default memakai cache backend singkat",
          },
          success: {
            source: "coingecko",
            baseAsset: "ETH",
            rates: {
              usd: 2500,
              idr: 41000000,
            },
            lastUpdatedAt: "2026-05-26T12:00:00.000Z",
            fetchedAt: "2026-05-26T12:00:00.000Z",
          },
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
          path: "/api/batches/completed-gas-fees",
          access: "Bearer JWT",
          mobileUse: false,
          headers: {
            Authorization: "Bearer <token>",
          },
          description:
            "Mengambil list batch completed yang sudah push ke blockchain, membaca receipt tx dari Etherscan API V2, lalu menghitung gas fee dari gasUsed x effectiveGasPrice.",
          query: {
            refresh: "true untuk memaksa tarik ulang dari Etherscan, default memakai cache transactionCost source etherscan",
          },
          success: {
            source: "etherscan",
            count: 1,
            rows: [
              {
                id: "uuid",
                batchCode: "TEA-2026-0001",
                status: "completed",
                txHash: "0x...",
                txUrl: "https://sepolia.etherscan.io/tx/0x...",
                transactionCost: {
                  gasUsed: "123456",
                  effectiveGasPriceWei: "1200000000",
                  gasFeeWei: "148147200000000",
                  gasFeeEth: "0.0001481472",
                  nativeCurrencySymbol: "ETH",
                  source: "etherscan",
                },
              },
            ],
          },
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
            transactionCost: {
              gasUsed: "123456",
              effectiveGasPriceWei: "1200000000",
              gasFeeWei: "148147200000000",
              gasFeeEth: "0.0001481472",
              nativeCurrencySymbol: "ETH",
              source: "wallet_receipt",
            },
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

const API_DOCS_ID_TRANSLATIONS = {
  "8 jam": "8 jam",
  "Alamat kontrak Sepolia dengan fungsi storeIpfsCid(string ipfsCid).":
    "Alamat kontrak Sepolia dengan fungsi storeIpfsCid(string ipfsCid).",
  "Alasan skip bila ada": "Alasan melewati tahap bila ada",
  "Ambil notifikasi persistent dari Supabase, lalu gunakan endpoint PATCH/DELETE untuk status dibaca atau hapus.":
    "Ambil notifikasi persisten dari Supabase, lalu gunakan endpoint PATCH/DELETE untuk status dibaca atau hapus.",
  [`API_DOCS_PASSWORD terisi password kuat minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter.`]:
    `API_DOCS_PASSWORD berisi kata sandi kuat minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter.`,
  "Authentication": "Autentikasi",
  "Backend membuat batch dengan stage awal plucking berstatus available.":
    "Backend membuat batch dengan tahap awal plucking berstatus available.",
  "Backend menyimpan payload tahap, refresh stage berikutnya, dan mengembalikan batch terbaru.":
    "Backend menyimpan payload tahap, menyegarkan tahap berikutnya, dan mengembalikan batch terbaru.",
  "Batch, traceability, atau endpoint tidak ditemukan.":
    "Batch, ketertelusuran, atau endpoint tidak ditemukan.",
  "Batch/tahap tidak ditemukan": "Batch atau tahap tidak ditemukan",
  "Chain default modal wallet. Anchor final aplikasi tetap Sepolia.":
    "Chain default modal wallet. Catatan final aplikasi tetap Sepolia.",
  "Development: http://<IP-laptop>:5173/api atau port Vite yang aktif. Production: https://<domain-produksi>/api.":
    "Development: http://<IP-laptop>:5173/api atau port Vite yang aktif. Production: https://<domain-produksi>/api.",
  "Dipakai backend untuk membaca receipt tx final dari Etherscan API V2 dan menghitung gas fee batch completed.":
    "Dipakai backend untuk membaca receipt tx final dari Etherscan API V2 dan menghitung biaya gas batch selesai.",
  "Diperlukan untuk QR/mobile WalletConnect. Browser wallet tetap bisa berjalan tanpa ini.":
    "Diperlukan untuk QR/mobile WalletConnect. Wallet browser tetap bisa berjalan tanpa ini.",
  "Docs password": "Kata sandi dokumentasi",
  "Email atau password salah": "Email atau kata sandi salah",
  "Email dan password wajib diisi": "Email dan kata sandi wajib diisi",
  "Endpoint publik untuk QR/public traceability, bisa dipakai tanpa login.":
    "Endpoint publik untuk QR/ketertelusuran publik, bisa dipakai tanpa login.",
  [`ETHERSCAN_API_KEY aktif agar dashboard bisa menampilkan gas fee tx blockchain batch completed.`]:
    "ETHERSCAN_API_KEY aktif agar dashboard bisa menampilkan biaya gas tx blockchain batch selesai.",
  [`Fallback password API Docs jika app_settings belum siap. Minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter di production.`]:
    `Fallback kata sandi dokumentasi API jika app_settings belum siap. Minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter di production.`,
  "Gunakan endpoint public untuk halaman QR/publik, endpoint internal untuk dashboard/mobile operator.":
    "Gunakan endpoint publik untuk halaman QR/publik, endpoint internal untuk dashboard/mobile operator.",
  "Hanya rolling dan postdrying yang boleh di-skip. Backend refresh stage berikutnya.":
    "Hanya rolling dan postdrying yang boleh dilewati. Backend menyegarkan tahap berikutnya.",
  "Input tidak lengkap, stage belum available, atau tahap tidak boleh di-skip.":
    "Input tidak lengkap, tahap belum available, atau tahap tidak boleh dilewati.",
  "Jika kosong, backend membuat CID mock dan tidak cocok untuk finalisasi blockchain production.":
    "Jika kosong, backend membuat CID mock dan tidak cocok untuk finalisasi blockchain production.",
  "Jika semua tahap completed/skipped, backend membuat final JSON ke Pinata otomatis. Status batch tetap in_progress sampai CID final anchored ke blockchain.":
    "Jika semua tahap completed/skipped, backend membuat JSON final ke Pinata otomatis. Status batch tetap in_progress sampai CID final tercatat ke blockchain.",
  [`JWT_SECRET terisi secret acak minimal ${MIN_JWT_SECRET_LENGTH} karakter.`]:
    `JWT_SECRET berisi secret acak minimal ${MIN_JWT_SECRET_LENGTH} karakter.`,
  "Keputusan skip dari awal proses": "Keputusan melewati tahap dari awal proses",
  "Login memakai email dan password user Supabase.": "Login memakai email dan kata sandi pengguna Supabase.",
  "Login user Supabase dan penerbitan JWT untuk web atau mobile app.":
    "Login pengguna Supabase dan penerbitan JWT untuk web atau aplikasi mobile.",
  "Membuat notifikasi untuk user aktif. Web memakai endpoint ini setelah batch dibuat, tahap disimpan/skip, dan blockchain selesai.":
    "Membuat notifikasi untuk pengguna aktif. Web memakai endpoint ini setelah batch dibuat, tahap disimpan/dilewati, dan blockchain selesai.",
  "Mengambil detail batch. Jika semua stage sudah completed/skipped, backend otomatis mencoba membuat final JSON Pinata. Batch baru completed setelah tx blockchain final tercatat.":
    "Mengambil detail batch. Jika semua tahap sudah completed/skipped, backend otomatis mencoba membuat JSON final Pinata. Batch baru selesai setelah tx blockchain final tercatat.",
  "Mengambil kurs ETH ke USD dan IDR dari CoinGecko untuk konversi gas fee dashboard.":
    "Mengambil kurs ETH ke USD dan IDR dari CoinGecko untuk konversi biaya gas dashboard.",
  "Mengambil list batch completed yang sudah push ke blockchain, membaca receipt tx dari Etherscan API V2, lalu menghitung gas fee dari gasUsed x effectiveGasPrice.":
    "Mengambil daftar batch selesai yang sudah dikirim ke blockchain, membaca receipt tx dari Etherscan API V2, lalu menghitung biaya gas dari gasUsed x effectiveGasPrice.",
  "Mengambil traceability internal batch. Tahap yang di-skip disembunyikan.":
    "Mengambil ketertelusuran internal batch. Tahap yang dilewati disembunyikan.",
  "Mengambil traceability publik batch. Tahap yang di-skip disembunyikan.":
    "Mengambil ketertelusuran publik batch. Tahap yang dilewati disembunyikan.",
  "Mengubah password akun login user yang sedang aktif. Endpoint ini dipakai halaman My Profile.":
    "Mengubah kata sandi akun login pengguna yang sedang aktif. Endpoint ini dipakai halaman Profil saya.",
  "Mengubah password API Docs dan menyimpan hash password baru ke tabel app_settings Supabase.":
    "Mengubah kata sandi dokumentasi API dan menyimpan hash kata sandi baru ke tabel app_settings Supabase.",
  "Menyimpan data tahap produksi yang sedang available. Pakai body sesuai stageFieldTemplates[stageName].":
    "Menyimpan data tahap produksi yang sedang available. Pakai body sesuai stageFieldTemplates[stageName].",
  "Menyimpan tx hash final CID setelah transaksi wallet berhasil. Endpoint ini tidak mengirim transaksi blockchain; transaksi dilakukan dari wallet client. Setelah tersimpan, status batch menjadi completed.":
    "Menyimpan hash tx final CID setelah transaksi wallet berhasil. Endpoint ini tidak mengirim transaksi blockchain; transaksi dilakukan dari wallet client. Setelah tersimpan, status batch menjadi completed.",
  "Mobile app memakai endpoint yang sama dengan web. Endpoint public tidak butuh token, endpoint operasional batch memakai Bearer JWT dari login.":
    "Aplikasi mobile memakai endpoint yang sama dengan web. Endpoint publik tidak butuh token, endpoint operasional batch memakai Bearer JWT dari login.",
  "Mobile mengirim txHash setelah transaksi wallet berhasil. Jika belum ada wallet mobile, finalisasi bisa tetap dari web.":
    "Mobile mengirim txHash setelah transaksi wallet berhasil. Jika belum ada wallet mobile, finalisasi bisa tetap dari web.",
  "Notifications": "Notifikasi",
  "Notifikasi user disimpan persistent di Supabase. Semua endpoint di grup ini memakai user dari Bearer JWT.":
    "Notifikasi pengguna disimpan persisten di Supabase. Semua endpoint di grup ini memakai pengguna dari Bearer JWT.",
  "Opsional, default 40, maksimal 100": "Opsional, default 40, maksimal 100",
  [`Password API Docs disimpan di tabel app_settings Supabase. Env API_DOCS_PASSWORD hanya fallback dan wajib minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter di production.`]:
    `Kata sandi dokumentasi API disimpan di tabel app_settings Supabase. Env API_DOCS_PASSWORD hanya fallback dan wajib minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter di production.`,
  "Password API Docs salah": "Kata sandi dokumentasi API salah",
  "Password API Docs berhasil diperbarui": "Kata sandi dokumentasi API berhasil diperbarui",
  "Password lama dan password baru wajib diisi / Password baru terlalu pendek / Password baru sama dengan password lama":
    "Kata sandi lama dan kata sandi baru wajib diisi / kata sandi baru terlalu pendek / kata sandi baru sama dengan kata sandi lama",
  [`Password lama dan password baru wajib diisi / password baru minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter`]:
    `Kata sandi lama dan kata sandi baru wajib diisi / kata sandi baru minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter`,
  "Password berhasil diperbarui": "Kata sandi berhasil diperbarui",
  "Public Traceability": "Ketertelusuran publik",
  "Role user tidak cukup untuk aksi admin.": "Peran pengguna tidak cukup untuk aksi admin.",
  "Seluruh object API_DOCS ini": "Seluruh objek API_DOCS ini",
  "Simpan token di secure storage mobile. Kirim header Authorization untuk endpoint dengan access Bearer JWT.":
    "Simpan token di secure storage mobile. Kirim header Authorization untuk endpoint dengan akses Bearer JWT.",
  "Skip tahap opsional bila diperlukan": "Lewati tahap opsional bila diperlukan",
  "Skip tahap opsional yang belum difinalisasi. Hanya stage dengan skippable true yang boleh di-skip.":
    "Lewati tahap opsional yang belum difinalisasi. Hanya tahap dengan skippable true yang boleh dilewati.",
  "System": "Sistem",
  "Tampilkan traceability": "Tampilkan ketertelusuran",
  "Tahap sudah difinalisasi / Tahap ini tidak boleh di-skip":
    "Tahap sudah difinalisasi / tahap ini tidak boleh dilewati",
  "Token tidak ada/salah, login gagal, atau password API Docs salah.":
    "Token tidak ada/salah, login gagal, atau kata sandi dokumentasi API salah.",
  "Token tidak valid atau password lama salah": "Token tidak valid atau kata sandi lama salah",
  "Traceability tidak ditemukan": "Ketertelusuran tidak ditemukan",
  "Tx hash wajib / CID final Pinata belum tersedia": "Hash tx wajib / CID final Pinata belum tersedia",
  "Ubah password akun login": "Ubah kata sandi akun login",
  "Ulangi sampai semua tahap finalized": "Ulangi sampai semua tahap final",
  "User bukan admin": "Pengguna bukan admin",
  "User mengirim password lama dan password baru. Setelah berhasil, login berikutnya memakai password baru.":
    "Pengguna mengirim kata sandi lama dan kata sandi baru. Setelah berhasil, login berikutnya memakai kata sandi baru.",
  "User tidak ditemukan": "Pengguna tidak ditemukan",
  "VITE_CONTRACT_ADDRESS menunjuk kontrak Sepolia production aplikasi.":
    "VITE_CONTRACT_ADDRESS menunjuk kontrak Sepolia production aplikasi.",
  [`Wajib minimal ${MIN_JWT_SECRET_LENGTH} karakter di production. Jangan pakai default development.`]:
    `Wajib minimal ${MIN_JWT_SECRET_LENGTH} karakter di production. Jangan pakai default development.`,
  "opsional": "opsional",
  "password API Docs baru minimal 12 karakter": `kata sandi dokumentasi API baru minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter`,
  "password API Docs lama": "kata sandi dokumentasi API lama",
  "password baru minimal 6 karakter": "kata sandi baru minimal 6 karakter",
  "password lama": "kata sandi lama",
  "wajib untuk gas fee dashboard": "wajib untuk biaya gas dashboard",
};

const API_DOCS_EN_TRANSLATIONS = {
  "8 jam": "8 hours",
  "Alamat kontrak Sepolia dengan fungsi storeIpfsCid(string ipfsCid).":
    "Sepolia contract address with the storeIpfsCid(string ipfsCid) function.",
  "Alasan skip bila ada": "Skip reason, if any",
  "Ambil daftar batch": "Fetch batch list",
  "Ambil notifikasi persistent dari Supabase, lalu gunakan endpoint PATCH/DELETE untuk status dibaca atau hapus.":
    "Fetch persistent notifications from Supabase, then use the PATCH/DELETE endpoints to mark them as read or delete them.",
  [`API_DOCS_PASSWORD terisi password kuat minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter.`]:
    `API_DOCS_PASSWORD contains a strong password with at least ${MIN_API_DOCS_PASSWORD_LENGTH} characters.`,
  "Backend membuat batch dengan stage awal plucking berstatus available.":
    "The backend creates a batch with the initial plucking stage set to available.",
  "Backend menyimpan payload tahap, refresh stage berikutnya, dan mengembalikan batch terbaru.":
    "The backend stores the stage payload, refreshes the next stage, and returns the updated batch.",
  "Base URL axios. Gunakan /api untuk Vercel/static deployment yang sama domain.":
    "Axios base URL. Use /api for Vercel/static deployments on the same domain.",
  "Base URL explorer untuk membentuk txUrl.": "Explorer base URL used to build txUrl.",
  "Batch tidak ditemukan": "Batch not found",
  "Batch UUID": "Batch UUID",
  "Batch, traceability, atau endpoint tidak ditemukan.":
    "Batch, traceability, or endpoint was not found.",
  "Batch/tahap tidak ditemukan": "Batch or stage not found",
  "batchCode dan teaType wajib diisi / Kode batch sudah ada":
    "batchCode and teaType are required / batch code already exists",
  "Buat batch baru": "Create new batch",
  "Buka detail batch": "Open batch detail",
  "Catatan awal batch": "Initial batch notes",
  "Chain default modal wallet. Anchor final aplikasi tetap Sepolia.":
    "Default wallet modal chain. The app's final anchor stays on Sepolia.",
  "Development: http://<IP-laptop>:5173/api atau port Vite yang aktif. Production: https://<domain-produksi>/api.":
    "Development: http://<laptop-IP>:5173/api or the active Vite port. Production: https://<production-domain>/api.",
  "Dipakai backend untuk membaca receipt tx final dari Etherscan API V2 dan menghitung gas fee batch completed.":
    "Used by the backend to read final tx receipts from Etherscan API V2 and calculate gas fees for completed batches.",
  "Dipakai npm run api/dev:server/start. Vercel memakai port internal sendiri.":
    "Used by npm run api/dev:server/start. Vercel uses its own internal port.",
  "Diperlukan untuk QR/mobile WalletConnect. Browser wallet tetap bisa berjalan tanpa ini.":
    "Required for QR/mobile WalletConnect. Browser wallets can still work without it.",
  "Disimpan untuk kompatibilitas env. Frontend saat ini memakai Express API melalui VITE_API_URL.":
    "Kept for env compatibility. The frontend currently uses the Express API through VITE_API_URL.",
  "Disimpan untuk kompatibilitas env. Jangan isi service role key di variable VITE_*.":
    "Kept for env compatibility. Do not put a service role key in VITE_* variables.",
  "Docs password": "Docs password",
  "Email atau password salah": "Email or password is incorrect",
  "Email dan password wajib diisi": "Email and password are required",
  "Endpoint batch produksi. Semua endpoint di grup ini butuh Bearer JWT.":
    "Production batch endpoints. Every endpoint in this group requires Bearer JWT.",
  "Endpoint GET /api/health mengembalikan { status: 'ok' } setelah deploy.":
    "The GET /api/health endpoint returns { status: 'ok' } after deployment.",
  "Endpoint publik untuk QR/public traceability, bisa dipakai tanpa login.":
    "Public endpoint for QR/public traceability, available without login.",
  [`ETHERSCAN_API_KEY aktif agar dashboard bisa menampilkan gas fee tx blockchain batch completed.`]:
    "ETHERSCAN_API_KEY is active so the dashboard can show blockchain tx gas fees for completed batches.",
  [`Fallback password API Docs jika app_settings belum siap. Minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter di production.`]:
    `Fallback API Docs password if app_settings is not ready. Minimum ${MIN_API_DOCS_PASSWORD_LENGTH} characters in production.`,
  "Gateway publik untuk URL file JSON final.": "Public gateway for final JSON file URLs.",
  "GET /api/batches/:id/traceability atau GET /api/batches/public/:id/traceability":
    "GET /api/batches/:id/traceability or GET /api/batches/public/:id/traceability",
  "http://<ip-laptop>:5173/api atau port Vite yang aktif":
    "http://<laptop-ip>:5173/api or the active Vite port",
  "Gunakan endpoint public untuk halaman QR/publik, endpoint internal untuk dashboard/mobile operator.":
    "Use the public endpoint for QR/public pages and the internal endpoint for the dashboard/mobile operator.",
  "Gunakan template dari stageFieldTemplates sesuai stageName":
    "Use the template from stageFieldTemplates for the selected stageName",
  "Hanya rolling dan postdrying yang boleh di-skip. Backend refresh stage berikutnya.":
    "Only rolling and postdrying can be skipped. The backend refreshes the next stage.",
  "Health check sederhana untuk memastikan API server merespons.":
    "Simple health check to make sure the API server responds.",
  "Input tahap aktif": "Input active stage",
  "Input tidak lengkap, stage belum available, atau tahap tidak boleh di-skip.":
    "Input is incomplete, the stage is not available yet, or the stage cannot be skipped.",
  "Jika diisi, RPC wallet memakai Alchemy untuk chain yang didukung.":
    "When filled, the wallet RPC uses Alchemy for supported chains.",
  "Jika kosong, backend membuat CID mock dan tidak cocok untuk finalisasi blockchain production.":
    "If empty, the backend creates a mock CID and it is not suitable for production blockchain finalization.",
  "Jika semua tahap completed/skipped, backend membuat final JSON ke Pinata otomatis. Status batch tetap in_progress sampai CID final anchored ke blockchain.":
    "If every stage is completed/skipped, the backend automatically creates the final JSON in Pinata. The batch status stays in_progress until the final CID is anchored to blockchain.",
  "Judul notifikasi wajib diisi": "Notification title is required",
  [`JWT_SECRET terisi secret acak minimal ${MIN_JWT_SECRET_LENGTH} karakter.`]:
    `JWT_SECRET contains a random secret with at least ${MIN_JWT_SECRET_LENGTH} characters.`,
  "Keputusan skip dari awal proses": "Early process skip decision",
  "Kesalahan backend saat proses data.": "Backend error while processing data.",
  "Key Supabase untuk backend jika service role key tidak dipakai.":
    "Supabase key for the backend when the service role key is not used.",
  "Koneksi, konfigurasi, atau schema Supabase belum siap.":
    "Supabase connection, configuration, or schema is not ready.",
  "Login gagal karena koneksi atau konfigurasi Supabase bermasalah":
    "Login failed because the Supabase connection or configuration has a problem",
  "Login memakai email dan password user Supabase.": "Login with a Supabase user email and password.",
  "Login operator/admin": "Operator/admin login",
  "Login user Supabase dan penerbitan JWT untuk web atau mobile app.":
    "Supabase user login and JWT issuance for the web or mobile app.",
  "Melihat status Supabase, Pinata, dan konfigurasi blockchain.":
    "View Supabase, Pinata, and blockchain configuration status.",
  "Membuat batch produksi baru.": "Create a new production batch.",
  "Membuat notifikasi untuk user aktif. Web memakai endpoint ini setelah batch dibuat, tahap disimpan/skip, dan blockchain selesai.":
    "Create a notification for the active user. The web app uses this endpoint after a batch is created, a stage is saved/skipped, and blockchain finalization completes.",
  "Menandai satu notifikasi sebagai sudah dibaca.": "Mark one notification as read.",
  "Menandai semua notifikasi user aktif sebagai sudah dibaca.":
    "Mark all active-user notifications as read.",
  "Mengambil daftar batch produksi.": "Fetch the production batch list.",
  "Mengambil daftar notifikasi user aktif, terbaru lebih dulu.":
    "Fetch active-user notifications, newest first.",
  "Mengambil detail batch. Jika semua stage sudah completed/skipped, backend otomatis mencoba membuat final JSON Pinata. Batch baru completed setelah tx blockchain final tercatat.":
    "Fetch batch detail. If every stage is completed/skipped, the backend automatically tries to create the final Pinata JSON. The batch becomes completed only after the final blockchain tx is recorded.",
  "Mengambil dokumentasi API untuk dashboard web. Mobile app tidak perlu memanggil endpoint ini.":
    "Fetch API documentation for the web dashboard. The mobile app does not need to call this endpoint.",
  "Mengambil kurs ETH ke USD dan IDR dari CoinGecko untuk konversi gas fee dashboard.":
    "Fetch ETH to USD and IDR rates from CoinGecko for dashboard gas fee conversion.",
  "Mengambil list batch completed yang sudah push ke blockchain, membaca receipt tx dari Etherscan API V2, lalu menghitung gas fee dari gasUsed x effectiveGasPrice.":
    "Fetch completed batches that have been pushed to blockchain, read tx receipts from Etherscan API V2, then calculate gas fees from gasUsed x effectiveGasPrice.",
  "Mengambil riwayat event batch dari Supabase.": "Fetch batch event history from Supabase.",
  "Mengambil traceability internal batch. Tahap yang di-skip disembunyikan.":
    "Fetch internal batch traceability. Skipped stages are hidden.",
  "Mengambil traceability publik batch. Tahap yang di-skip disembunyikan.":
    "Fetch public batch traceability. Skipped stages are hidden.",
  "Menghapus semua notifikasi milik user aktif.": "Delete all notifications for the active user.",
  "Mengubah password akun login user yang sedang aktif. Endpoint ini dipakai halaman My Profile.":
    "Change the active user's login password. This endpoint is used by the My Profile page.",
  "Mengubah password API Docs dan menyimpan hash password baru ke tabel app_settings Supabase.":
    "Change the API Docs password and store the new password hash in the Supabase app_settings table.",
  "Menyimpan data tahap produksi yang sedang available. Pakai body sesuai stageFieldTemplates[stageName].":
    "Save data for the currently available production stage. Use the body shape from stageFieldTemplates[stageName].",
  "Menyimpan tx hash final CID setelah transaksi wallet berhasil. Endpoint ini tidak mengirim transaksi blockchain; transaksi dilakukan dari wallet client. Setelah tersimpan, status batch menjadi completed.":
    "Save the final CID tx hash after the wallet transaction succeeds. This endpoint does not send the blockchain transaction; the client wallet does. After it is saved, the batch status becomes completed.",
  "Migrasi Supabase sudah dipush, termasuk tabel users, batches, batch_history, app_settings, dan notifications.":
    "Supabase migrations have been pushed, including users, batches, batch_history, app_settings, and notifications tables.",
  "Mobile app memakai endpoint yang sama dengan web. Endpoint public tidak butuh token, endpoint operasional batch memakai Bearer JWT dari login.":
    "The mobile app uses the same endpoints as the web app. Public endpoints do not need a token; operational batch endpoints use the Bearer JWT from login.",
  "Mobile membaca stages. Tombol input muncul untuk stage dengan status available.":
    "Mobile reads stages. The input button appears for stages with available status.",
  "Mobile mengirim txHash setelah transaksi wallet berhasil. Jika belum ada wallet mobile, finalisasi bisa tetap dari web.":
    "Mobile sends txHash after the wallet transaction succeeds. If mobile wallet support is not ready, finalization can still happen from the web app.",
  "Notifikasi tidak ditemukan": "Notification not found",
  "Notifikasi user disimpan persistent di Supabase. Semua endpoint di grup ini memakai user dari Bearer JWT.":
    "User notifications are stored persistently in Supabase. Every endpoint in this group uses the user from the Bearer JWT.",
  "opsional": "optional",
  "opsional untuk mock, wajib untuk live Pinata": "optional for mock, required for live Pinata",
  "Opsional, default 40, maksimal 100": "Optional, default 40, maximum 100",
  "password API Docs baru minimal 12 karakter": `new API Docs password with at least ${MIN_API_DOCS_PASSWORD_LENGTH} characters`,
  "Password API Docs berhasil diperbarui": "API Docs password updated successfully",
  [`Password API Docs disimpan di tabel app_settings Supabase. Env API_DOCS_PASSWORD hanya fallback dan wajib minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter di production.`]:
    `The API Docs password is stored in the Supabase app_settings table. Env API_DOCS_PASSWORD is only a fallback and must be at least ${MIN_API_DOCS_PASSWORD_LENGTH} characters in production.`,
  "password API Docs lama": "current API Docs password",
  "Password API Docs salah": "API Docs password is incorrect",
  "password baru minimal 6 karakter": "new password with at least 6 characters",
  "Password berhasil diperbarui": "Password updated successfully",
  "password lama": "current password",
  [`Password lama dan password baru wajib diisi / password baru minimal ${MIN_API_DOCS_PASSWORD_LENGTH} karakter`]:
    `Current password and new password are required / new password must be at least ${MIN_API_DOCS_PASSWORD_LENGTH} characters`,
  "Password lama dan password baru wajib diisi / Password baru terlalu pendek / Password baru sama dengan password lama":
    "Current password and new password are required / new password is too short / new password is the same as the current password",
  "frontend dan backend blockchain status": "frontend and backend blockchain status",
  "PINATA_JWT dan PINATA_GATEWAY aktif jika CID final harus benar-benar tersimpan di Pinata.":
    "PINATA_JWT and PINATA_GATEWAY are active if final CIDs must be stored in Pinata for real.",
  "Plucking untuk TEA-2026-0001 berhasil dicatat.":
    "Plucking for TEA-2026-0001 was recorded successfully.",
  "Project ref Supabase. Jika SUPABASE_URL kosong, backend membentuk URL dari project ref ini.":
    "Supabase project ref. If SUPABASE_URL is empty, the backend builds the URL from this project ref.",
  "Role user tidak cukup untuk aksi admin.": "User role is not sufficient for admin actions.",
  "Schema Supabase belum siap": "Supabase schema is not ready",
  "Seluruh object API_DOCS ini": "This entire API_DOCS object",
  "server dan Supabase CLI": "server and Supabase CLI",
  "server lokal": "local server",
  "Simpan token dan data user.": "Store the token and user data.",
  "Simpan token di secure storage mobile. Kirim header Authorization untuk endpoint dengan access Bearer JWT.":
    "Store the token in mobile secure storage. Send the Authorization header for endpoints with Bearer JWT access.",
  "Simpan tx blockchain final jika mobile wallet dipakai":
    "Save final blockchain tx if a mobile wallet is used",
  "Sinkron notifikasi user": "Sync user notifications",
  "Skip tahap opsional bila diperlukan": "Skip optional stage when needed",
  "Skip tahap opsional yang belum difinalisasi. Hanya stage dengan skippable true yang boleh di-skip.":
    "Skip an optional stage that has not been finalized. Only stages with skippable true can be skipped.",
  "Status integrasi backend, storage, IPFS, blockchain, dan dokumentasi.":
    "Backend, storage, IPFS, blockchain, and documentation integration status.",
  "Tabel app_settings belum siap": "The app_settings table is not ready",
  "Tabel notifications Supabase belum siap": "The Supabase notifications table is not ready",
  "Tahap belum tersedia untuk diproses": "The stage is not ready to be processed",
  "Tahap sudah difinalisasi / Tahap ini tidak boleh di-skip":
    "Stage has already been finalized / this stage cannot be skipped",
  "Tahap tersimpan": "Stage saved",
  "Tampilkan list batch produksi dan statusnya.": "Show the production batch list and statuses.",
  "Tampilkan traceability": "Show traceability",
  "Token CLI Supabase. Jangan expose ke browser.": "Supabase CLI token. Do not expose it to the browser.",
  "Token tidak ada/salah, login gagal, atau password API Docs salah.":
    "Token is missing/incorrect, login failed, or the API Docs password is incorrect.",
  "Token tidak valid atau password lama salah": "Token is invalid or current password is incorrect",
  "Traceability tidak ditemukan": "Traceability not found",
  "true untuk memaksa ambil ulang dari CoinGecko, default memakai cache backend singkat":
    "true to force refetching from CoinGecko; by default it uses the short backend cache",
  "true untuk memaksa tarik ulang dari Etherscan, default memakai cache transactionCost source etherscan":
    "true to force refetching from Etherscan; by default it uses the cached transactionCost with etherscan source",
  "Tx hash wajib / CID final Pinata belum tersedia": "Tx hash is required / final Pinata CID is not available",
  "Ubah password akun login": "Change login account password",
  "Ulangi sampai semua tahap finalized": "Repeat until every stage is finalized",
  "URL project Supabase untuk API backend.": "Supabase project URL for the backend API.",
  "User bukan admin": "User is not an admin",
  "User mengirim password lama dan password baru. Setelah berhasil, login berikutnya memakai password baru.":
    "User sends the current password and new password. After success, the next login uses the new password.",
  "User tidak ditemukan": "User not found",
  "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY sudah sesuai project production.":
    "SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY match the production project.",
  "VITE_API_URL memakai /api jika frontend dan API berada di domain yang sama.":
    "VITE_API_URL uses /api when the frontend and API are on the same domain.",
  "VITE_CONTRACT_ADDRESS menunjuk kontrak Sepolia production aplikasi.":
    "VITE_CONTRACT_ADDRESS points to the app's production Sepolia contract.",
  [`Wajib minimal ${MIN_JWT_SECRET_LENGTH} karakter di production. Jangan pakai default development.`]:
    `Required minimum ${MIN_JWT_SECRET_LENGTH} characters in production. Do not use the default development value.`,
  "wajib untuk gas fee dashboard": "required for dashboard gas fees",
};

function localizeApiDocsValue(value, translations) {
  if (typeof value === "string") {
    return translations[value] || value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => localizeApiDocsValue(item, translations));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, localizeApiDocsValue(item, translations)])
    );
  }

  return value;
}

export const API_DOCS_LOCALIZATIONS = {
  id: localizeApiDocsValue(API_DOCS, API_DOCS_ID_TRANSLATIONS),
  en: localizeApiDocsValue(API_DOCS, API_DOCS_EN_TRANSLATIONS),
};
