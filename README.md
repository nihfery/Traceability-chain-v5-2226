# Tealabs

Aplikasi ini sudah disatukan menjadi satu folder dan satu package. Untuk development, frontend berjalan langsung dengan Vite supaya HMR aktif dan halaman tidak perlu reload manual. Backend Express tetap tersedia di package yang sama.

## Fitur

- dashboard paper-style yang responsif
- tombol **Connect Wallet** di topbar setelah login
- integrasi **wagmi + ConnectKit** untuk wallet browser dan mobile wallet flow
- batch memakai **dynamic multi-path** tanpa dropdown alur
- tahap opsional bisa **di-skip dari awal proses**
- complete/skip ditampung dulu di Supabase
- saat batch final, seluruh tahap digabung menjadi satu JSON Pinata
- CID final saja yang dikirim ke smart contract Sepolia lewat transaksi manual MetaMask

## Env

Copy `.env.example` ke `.env`. Jangan pakai nilai default development untuk production.

```env
PORT=5000
SUPABASE_PROJECT_REF=yunrneklsqjfoklmjeqm
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
SUPABASE_SERVICE_ROLE_KEY=
VITE_API_URL=/api
VITE_DEFAULT_CHAIN_ID=11155111
VITE_ALCHEMY_API_KEY=
VITE_WALLETCONNECT_PROJECT_ID=
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
JWT_SECRET=replace_with_at_least_32_random_chars
API_DOCS_PASSWORD=replace_with_strong_docs_password
PINATA_JWT=
PINATA_GATEWAY=your-gateway.mypinata.cloud
BLOCK_EXPLORER_URL=https://sepolia.etherscan.io
ETHERSCAN_API_KEY=
```

Connect wallet memakai UI default ConnectKit. Isi `VITE_WALLETCONNECT_PROJECT_ID` agar flow WalletConnect/QR untuk mobile wallet aktif penuh.
Isi `VITE_CONTRACT_ADDRESS` dengan kontrak yang memiliki fungsi `storeIpfsCid(string ipfsCid)`. Tidak ada `PRIVATE_KEY`; transaksi Sepolia harus dikonfirmasi manual dari MetaMask.
Untuk production, isi `JWT_SECRET` minimal 32 karakter dan `API_DOCS_PASSWORD` minimal 12 karakter. Aplikasi akan menolak fallback lemah saat berjalan dalam mode production.

## Supabase

Link project:

```bash
supabase login
supabase link --project-ref yunrneklsqjfoklmjeqm
```

Push schema:

```bash
supabase db push
```

Backend bisa memakai `SUPABASE_SERVICE_ROLE_KEY` untuk operasi API server-side. Jika memakai publishable key, pastikan policy Supabase sudah sesuai dengan kebutuhan akses aplikasi.

## Jalankan

```bash
npm install
npm run dev
```

Browser akan terbuka otomatis dari Vite, biasanya di `http://localhost:5173`.
Endpoint `/api` juga aktif di server Vite yang sama, jadi login dan data Supabase bisa dipakai tanpa terminal API kedua.
Menu **API Docs** di sidebar memakai password dari tabel Supabase `app_settings` (`api_docs_password`). `API_DOCS_PASSWORD` hanya fallback kalau tabel belum siap. Setelah docs terbuka, admin bisa mengganti password dari halaman yang sama.

Kalau hanya ingin menjalankan API Express tanpa frontend:

```bash
npm run api
```

Kalau ingin menjalankan frontend dan backend dari satu server seperti production:

```bash
npm run dev:server
```

## Production

```bash
npm run build
npm start
```

## Deploy ke Vercel

Project ini siap dipakai sebagai Vite static app + Vercel Functions untuk endpoint `/api/*`.

Pengaturan Vercel:

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Framework Preset: `Vite`

Isi Environment Variables di Vercel Project Settings, minimal:

```env
SUPABASE_PROJECT_REF=yunrneklsqjfoklmjeqm
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
VITE_API_URL=/api
VITE_DEFAULT_CHAIN_ID=11155111
VITE_ALCHEMY_API_KEY=
VITE_WALLETCONNECT_PROJECT_ID=
VITE_CONTRACT_ADDRESS=...
JWT_SECRET=isi_dengan_secret_panjang
API_DOCS_PASSWORD=isi_dengan_password_docs_yang_kuat
PINATA_JWT=
PINATA_GATEWAY=
BLOCK_EXPLORER_URL=https://sepolia.etherscan.io
ETHERSCAN_API_KEY=
```

`VITE_WALLETCONNECT_PROJECT_ID` boleh dikosongkan. Jika kosong, ConnectKit tetap menampilkan wallet browser seperti MetaMask dan Coinbase, tetapi QR/mobile WalletConnect tidak diaktifkan. Isi dengan project ID valid dari WalletConnect Cloud hanya kalau ingin QR/mobile wallet aktif.

Wallet UI mendukung pilihan jaringan Sepolia, Ethereum, Polygon, Base, Arbitrum, dan Optimism. `VITE_DEFAULT_CHAIN_ID` mengatur jaringan awal yang dipilih di modal wallet. Transaksi anchor final tetap dikirim ke Sepolia karena kontrak aplikasi saat ini dikonfigurasi di Sepolia.
Isi `VITE_ALCHEMY_API_KEY` agar semua RPC jaringan memakai Alchemy secara otomatis.
Isi `ETHERSCAN_API_KEY` agar dashboard bisa mengambil gas fee batch completed dari receipt transaksi Etherscan.
Konversi gas fee ke USD dan Rupiah ditarik otomatis dari CoinGecko dan di-refresh berkala oleh dashboard.
