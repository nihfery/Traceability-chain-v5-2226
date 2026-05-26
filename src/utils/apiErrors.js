const EN_MESSAGES = {
  "Alamat smart contract belum dikonfigurasi.": "Smart contract address is not configured.",
  "Batch tidak ditemukan": "Batch not found.",
  "Batch/tahap tidak ditemukan": "Batch or stage not found.",
  "CID final Pinata belum tersedia untuk batch ini": "Final Pinata CID is not available for this batch.",
  "CoinGecko tidak mengembalikan kurs ETH USD/IDR.": "CoinGecko did not return ETH USD/IDR rates.",
  "Email atau password salah": "Email or password is incorrect.",
  "Email dan password wajib diisi": "Email and password are required.",
  "ETHERSCAN_API_KEY belum dikonfigurasi.": "ETHERSCAN_API_KEY is not configured.",
  "Gagal mengambil gas fee dari Etherscan.": "Failed to load gas fees from Etherscan.",
  "Gagal mengambil kurs ETH USD/IDR.": "Failed to load ETH USD/IDR rates.",
  "Gagal membaca API Docs": "Failed to load API Docs.",
  "Gagal membaca password API Docs": "Failed to load the API Docs password.",
  "Gagal mengubah password API Docs": "Failed to change the API Docs password.",
  "Gagal memperbarui password": "Failed to update password.",
  "Gagal menyimpan tahapan": "Failed to save stage.",
  "Gagal membuat batch baru": "Failed to create batch.",
  "Hanya admin yang bisa mengubah password API Docs": "Only admins can change the API Docs password.",
  "Jenis teh tidak valid": "Tea type is invalid.",
  "Judul notifikasi wajib diisi": "Notification title is required.",
  "JSON final tidak bisa dibuat ulang karena CID lama sudah tercatat di blockchain.":
    "The final JSON cannot be regenerated because the previous CID is already recorded on-chain.",
  "Kode batch sudah ada": "Batch code already exists.",
  "Login gagal": "Login failed.",
  "Login gagal karena koneksi atau konfigurasi Supabase bermasalah":
    "Login failed because the Supabase connection or configuration has a problem.",
  "Password API Docs berhasil diperbarui": "API Docs password updated successfully.",
  "Password API Docs lama salah": "The current API Docs password is incorrect.",
  "Password API Docs salah": "API Docs password is incorrect.",
  "Password API Docs di Supabase masih memakai default development.":
    "The API Docs password in Supabase is still using the default development value.",
  "Password berhasil diperbarui": "Password updated successfully.",
  "Password baru harus berbeda dari password lama": "New password must be different from the current password.",
  "Password baru minimal 6 karakter": "New password must be at least 6 characters.",
  "Password baru sama dengan password lama": "New password must be different from the current password.",
  "Password lama dan password baru wajib diisi": "Current password and new password are required.",
  "Password lama salah": "Current password is incorrect.",
  "Tahap belum tersedia untuk diproses": "This stage is not ready to be processed yet.",
  "Tahap ini sudah difinalisasi": "This stage has already been finalized.",
  "Tahap ini tidak boleh di-skip": "This stage cannot be skipped.",
  "Tahap tidak ditemukan dalam batch ini": "Stage not found in this batch.",
  "Receipt Etherscan tidak memuat gasUsed/effectiveGasPrice.":
    "The Etherscan receipt does not include gasUsed/effectiveGasPrice.",
  "Tabel app_settings Supabase belum siap. Jalankan migrasi Supabase dulu.":
    "The Supabase app_settings table is not ready. Run the Supabase migration first.",
  "Tabel notifications Supabase belum siap": "The Supabase notifications table is not ready.",
  "Token tidak valid": "Token is invalid.",
  "Token tidak valid atau password lama salah": "Token is invalid or the current password is incorrect.",
  "Traceability publik menunggu transaksi blockchain final":
    "Public traceability is waiting for the final blockchain transaction.",
  "Traceability tidak ditemukan": "Traceability not found.",
  "Tx hash wajib dikirim setelah transaksi MetaMask berhasil":
    "Tx hash is required after the MetaMask transaction succeeds.",
  "Tx hash tidak valid untuk query Etherscan.": "Tx hash is invalid for the Etherscan query.",
  "User tidak ditemukan": "User not found.",
  "User bukan admin": "User is not an admin.",
  "Unauthorized": "Unauthorized.",
  "Invalid token": "Invalid token.",
  "batchCode dan teaType wajib diisi": "batchCode and teaType are required.",
};

const ID_MESSAGES = {
  "Batch tidak ditemukan": "Batch tidak ditemukan.",
  "Batch/tahap tidak ditemukan": "Batch atau tahap tidak ditemukan.",
  "CoinGecko tidak mengembalikan kurs ETH USD/IDR.": "CoinGecko tidak mengembalikan kurs ETH USD/IDR.",
  "Email atau password salah": "Email atau kata sandi salah.",
  "Email dan password wajib diisi": "Email dan kata sandi wajib diisi.",
  "Gagal mengambil gas fee dari Etherscan.": "Gagal mengambil biaya gas dari Etherscan.",
  "Gagal membaca API Docs": "Gagal membaca dokumentasi API.",
  "Gagal membaca password API Docs": "Gagal membaca kata sandi dokumentasi API.",
  "Gagal mengubah password API Docs": "Gagal mengubah kata sandi dokumentasi API.",
  "Gagal memperbarui password": "Gagal memperbarui kata sandi.",
  "Hanya admin yang bisa mengubah password API Docs": "Hanya admin yang bisa mengubah kata sandi dokumentasi API.",
  "Judul notifikasi wajib diisi": "Judul notifikasi wajib diisi.",
  "Password API Docs berhasil diperbarui": "Kata sandi dokumentasi API berhasil diperbarui.",
  "Password API Docs lama salah": "Kata sandi dokumentasi API lama salah.",
  "Password API Docs salah": "Kata sandi dokumentasi API salah.",
  "Password API Docs di Supabase masih memakai default development.":
    "Kata sandi dokumentasi API di Supabase masih memakai default development.",
  "Password berhasil diperbarui": "Kata sandi berhasil diperbarui.",
  "Password baru harus berbeda dari password lama": "Kata sandi baru harus berbeda dari kata sandi lama.",
  "Password baru minimal 6 karakter": "Kata sandi baru minimal 6 karakter.",
  "Password baru sama dengan password lama": "Kata sandi baru harus berbeda dari kata sandi lama.",
  "Password lama dan password baru wajib diisi": "Kata sandi lama dan kata sandi baru wajib diisi.",
  "Password lama salah": "Kata sandi lama salah.",
  "Tahap ini tidak boleh di-skip": "Tahap ini tidak boleh dilewati.",
  "Receipt Etherscan tidak memuat gasUsed/effectiveGasPrice.":
    "Receipt Etherscan tidak memuat gasUsed/effectiveGasPrice.",
  "Traceability publik menunggu transaksi blockchain final":
    "Ketertelusuran publik menunggu transaksi blockchain final.",
  "Traceability tidak ditemukan": "Ketertelusuran tidak ditemukan.",
  "Tx hash wajib dikirim setelah transaksi MetaMask berhasil":
    "Hash tx wajib dikirim setelah transaksi MetaMask berhasil.",
  "Tx hash tidak valid untuk query Etherscan.": "Hash tx tidak valid untuk query Etherscan.",
  "User tidak ditemukan": "Pengguna tidak ditemukan.",
  "User bukan admin": "Pengguna bukan admin.",
  "Unauthorized": "Belum login atau sesi tidak valid.",
  "Invalid token": "Token tidak valid.",
};

function translateDynamicMessage(message, language) {
  if (!message) {
    return message;
  }

  if (language === "id") {
    return message
      .replace(/Password/g, "Kata sandi")
      .replace(/password/g, "kata sandi")
      .replace(/API Docs/g, "dokumentasi API")
      .replace(/gas fee/g, "biaya gas")
      .replace(/Gas fee/g, "Biaya gas")
      .replace(/Traceability/g, "Ketertelusuran")
      .replace(/di-skip/g, "dilewati");
  }

  if (language !== "en") {
    return message;
  }

  if (message.startsWith("Supabase ")) {
    return message
      .replace("gagal", "failed")
      .replace("belum siap", "is not ready")
      .replace("Schema", "Schema");
  }

  if (message.includes("Password baru minimal")) {
    return "New password does not meet the minimum length.";
  }

  if (message.includes("password baru minimal")) {
    return "New password does not meet the minimum length.";
  }

  if (message.includes("CoinGecko gagal merespons")) {
    return message.replace("gagal merespons", "failed to respond");
  }

  if (message.includes("Etherscan gagal merespons")) {
    return message.replace("gagal merespons", "failed to respond");
  }

  if (message.includes("CoinGecko tidak mengembalikan kurs")) {
    return "CoinGecko did not return the requested exchange rates.";
  }

  if (message.startsWith("Tahap ") && message.includes("belum tersedia untuk diproses")) {
    const stage = message.replace("Tahap ", "").replace(" belum tersedia untuk diproses", "");
    return `Stage ${stage} is not ready to be processed yet.`;
  }

  if (message.includes("API_DOCS_PASSWORD wajib diisi")) {
    return "API_DOCS_PASSWORD must be set to a strong production password.";
  }

  return message;
}

export function translateApiMessage(message, language = "id", fallback = "") {
  const cleanMessage = typeof message === "string" ? message.trim() : "";
  const cleanFallback = typeof fallback === "string" ? fallback : "";

  if (!cleanMessage) {
    return cleanFallback;
  }

  if (language === "id") {
    return ID_MESSAGES[cleanMessage] || translateDynamicMessage(cleanMessage, language) || cleanFallback;
  }

  if (language !== "en") {
    return cleanMessage || cleanFallback;
  }

  return EN_MESSAGES[cleanMessage] || translateDynamicMessage(cleanMessage, language) || cleanFallback;
}

export function getApiErrorMessage(error, language = "id", fallback = "") {
  return translateApiMessage(error?.response?.data?.message, language, fallback);
}
