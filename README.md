# TugasKu — Manajemen Tugas Mahasiswa

Aplikasi web untuk membantu mahasiswa mengelola dan memprioritaskan tugas-tugas perkuliahan. Dilengkapi dengan kalkulasi prioritas tugas otomatis, visualisasi kalender rentang pengerjaan, pencarian teks real-time, filter semester dan mata kuliah terstruktur, manajemen tahapan subtugas (checklist), ekspor-impor data (CSV & Backup JSON), cetak rekap jadwal, serta pengingat tenggat waktu (deadline). Seluruh data disimpan langsung di sisi peramban pengguna menggunakan **localStorage**.

## Fitur Utama

- **Manajemen Tugas Kuliah**: Tambah, ubah, hapus, dan perbarui status tugas (Belum, Sedang, Selesai).
- **Penghitungan Prioritas Tugas**: Mengurutkan tugas secara sistematis berdasarkan kedekatan tenggat waktu (deadline) dan bobot kesulitan tugas (skala 1–5).
- **Katalog Mata Kuliah Riil**: Terintegrasi langsung dengan daftar mata kuliah Program Studi Sistem Informasi (Semester 1–8 dan Kesetaraan).
- **Pencarian Real-Time**: Mencari tugas secara cepat berdasarkan judul tugas, kode mata kuliah (utama maupun kode lama), serta nama mata kuliah dengan penyorotan teks (*highlight*).
- **Filter Semester & Mata Kuliah**: Menyaring daftar tugas berdasarkan kelompok semester dan mata kuliah yang sedang aktif diambil.
- **Tahapan / Subtugas (Checklist)**: Memecah tugas besar menjadi beberapa tahapan checklist dengan bilah kemajuan (*progress bar*) dan sinkronisasi status otomatis.
- **Tampilan Kalender**: Memvisualisasikan rentang pengerjaan tugas dari tanggal mulai hingga deadline secara interaktif.
- **Ekspor & Impor Data Dua Arah**:
  - Impor dari berkas spreadsheet CSV atau pemulihan dari berkas cadangan JSON (*merge* atau *replace*).
  - Ekspor seluruh data tugas ke CSV (kompatibel Excel dengan UTF-8 BOM) dan berkas cadangan JSON.
  - Halaman cetak jadwal (*printable schedule*) yang rapi dan teroptimasi untuk cetak fisik maupun PDF.
- **Pengaturan Semester Aktif**: Menyimpan preferensi semester mahasiswa agar pemilihan mata kuliah pada formulir tugas lebih terarah.
- **Notifikasi Pengingat**: Pengingat deadline dalam aplikasi (*in-app toast*) dan notifikasi peramban (*browser desktop notification*) pada H-3, H-1, dan hari H deadline.
- **Penyimpanan Lokal**: Berjalan sepenuhnya di sisi klien tanpa server database eksternal.

## Teknologi yang Digunakan

Aplikasi **TugasKu** dibangun menggunakan arsitektur modern *Single Page Application* (SPA) berbasis web di sisi klien (*client-side*):

- **React 18 & Vite**: Framework UI berbasis komponen modern untuk rendering cepat dan build bundling efisien.
- **Tailwind CSS**: Framework styling utilitas untuk antarmuka yang bersih, responsif di ponsel dan desktop, serta ramah pengguna.
- **Zustand & Web Storage API (`localStorage`)**: State management reaktif yang tersinkronisasi otomatis ke memori lokal peramban tanpa memerlukan backend database server.
- **FullCalendar (`@fullcalendar/react`)**: Komponen kalender interaktif untuk visualisasi rentang pengerjaan tugas dari tanggal mulai hingga deadline.
- **Lucide React**: Paket ikon antarmuka grafis yang konsisten.
- **Vitest**: Framework pengujian unit (*automated unit testing*) dengan total 102 kasus uji yang lulus 100%.

### Ringkasan Arsitektur Teknologi untuk Poster / Presentasi

| Komponen Sistem | Teknologi yang Digunakan | Peran dalam Sistem |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Tailwind CSS | Antarmuka pengguna responsif (Dashboard, Kalender, Form) |
| **Build Tool** | Vite 5 | Pengembangan cepat & kompilasi produksi efisien |
| **State & Penyimpanan** | Zustand + `localStorage` | Menyimpan data tugas & riwayat notifikasi di browser tanpa server |
| **Visualisasi Kalender** | FullCalendar v6 | Tampilan jadwal rentang waktu tugas secara visual |
| **Metode Prioritas** | Simple Additive Weighting (SAW) | Menghitung urutan tugas objektif: $P = (0,6 \times U) + (0,4 \times K)$ |
| **Pengujian (Testing)** | Vitest (102 Automated Tests) | Memvalidasi rumus prioritas, validasi input, parser CSV, dan pengingat |
| **Deployment CI/CD** | GitHub Pages & GitHub Actions | Hosting otomatis dan pengujian pipa rilis secara online |

## Struktur Folder

```
├── public/                 # Aset statis & berkas contoh
│   ├── favicon.svg
│   └── contoh-tugas.csv
├── src/
│   ├── components/         # Komponen antarmuka pengguna
│   │   ├── calendar/       # Komponen FullCalendar
│   │   ├── layout/         # Header, navigasi, menu ekspor, notifikasi, shell aplikasi
│   │   ├── notifications/  # Komponen toast notifikasi
│   │   ├── tasks/          # Kartu tugas, formulir, modal impor, filter status & matkul, pencarian
│   │   └── ui/             # Komponen reusable (Button, Modal, Field, dll)
│   ├── data/               # Katalog mata kuliah resmi (courses.js)
│   ├── hooks/              # Custom hooks (useToday, useRankedTasks, useReminders, useHashPage, dll)
│   ├── lib/                # Logika bisnis murni (bebas ketergantungan UI)
│   │   ├── constants.js    # Konstanta status, bobot, dan level prioritas
│   │   ├── dates.js        # Utilitas manipulasi tanggal & hitung mundur
│   │   ├── priority.js     # Formula kalkulasi skor prioritas
│   │   ├── csv.js          # Parser dan validator CSV
│   │   ├── export.js       # Generator CSV, backup JSON, dan nama berkas
│   │   ├── download.js     # Helper pengunduhan berkas di browser
│   │   ├── courseFilter.js # Pengelompokan & filter mata kuliah per semester
│   │   ├── courseOptions.js# Pengurutan opsi semester aktif di formulir
│   │   ├── searchTasks.js  # Mesin pencarian teks & pemotongan highlight
│   │   ├── subtasks.js     # Perhitungan progres, sinkronisasi status, & migrasi data
│   │   ├── browserNotify.js# Pembungkus Notification API peramban
│   │   ├── selectNotifiable.js # Logika seleksi notifikasi di latar belakang
│   │   ├── reminders.js    # Aturan tahapan pengingat tenggat waktu
│   │   └── validation.js   # Skema validasi dan normalisasi data tugas
│   ├── pages/              # Halaman utama (DashboardPage, CalendarPage, PrintPage)
│   ├── store/              # State store Zustand (taskStore, uiStore, toastStore, settingsStore)
│   ├── App.jsx             # Komponen root aplikasi
│   ├── index.css           # Styling Tailwind dan tema kalender
│   └── main.jsx            # Titik masuk utama aplikasi React
├── package.json            # Dependensi dan skrip proyek
└── vite.config.js          # Konfigurasi Vite & runner Vitest
```

## Aliran Data Aplikasi

1. **State Penyimpanan (`src/store/taskStore.js` & `settingsStore.js`)**:
   Menjadi pusat data tugas dan preferensi pengguna yang tersinkronisasi otomatis dengan `localStorage`.
2. **Kalkulasi & Hooks (`src/hooks/useRankedTasks.js`)**:
   Membaca daftar tugas dari store, menghitung skor prioritas melalui `src/lib/priority.js`, lalu mengurutkan tugas dari prioritas tertinggi ke terendah secara dinamis.
3. **Pipeline Penyaringan di Dashboard (`src/pages/DashboardPage.jsx`)**:
   Daftar tugas terurut dialirkan melalui filter semester/mata kuliah $\to$ mesin pencarian teks $\to$ filter status tugas.
4. **Komponen Presentasi (`src/pages/` & `src/components/`)**:
   Menerima data hasil penyaringan untuk ditampilkan pada Dashboard, Kalender, maupun Lembar Cetak.

---

## Logika Penghitungan Prioritas

Skor prioritas dihitung menggunakan metode **Simple Additive Weighting (SAW)** dalam skala 20–100 berdasarkan formula (Bab 2.6 Laporan Kemajuan Capstone Project STSI4440):

$$P = (0,6 \times U) + (0,4 \times K)$$

- **Skor Urgensi ($U$) — Tabel 2.2**:
  - Lebih dari 14 hari: **$20$**
  - 8–14 hari: **$40$**
  - 4–7 hari: **$60$**
  - 2–3 hari (mencakup H-3): **$80$**
  - 0–1 hari (mencakup H-1 dan hari H): **$100$**
  - Deadline terlewat ($< 0$ hari): **$100$** *(ditandai terlambat)*
- **Skor Kesulitan ($K$) — Rumus 2.2**:
  $$K = (D / 5) \times 100$$
  dengan $D \in \{1, 2, 3, 4, 5\}$ menghasilkan $K \in \{20, 40, 60, 80, 100\}$.
- **Aturan Pengurutan & Seri**:
  - Tugas aktif (`belum` dan `sedang`) ditempatkan di atas tugas `selesai`.
  - Diurutkan dari skor prioritas $P$ tertinggi ke terendah.
  - Jika skor sama (seri), tugas dengan deadline lebih dekat ditempatkan lebih dahulu, lalu tingkat kesulitan lebih tinggi.

Level prioritas:
- **Kritis**: Skor $\ge 75$
- **Tinggi**: Skor $\ge 60$
- **Sedang**: Skor $\ge 40$
- **Rendah**: Skor $< 40$

---

## Pengingat Deadline & Notifikasi

Pengingat tenggat waktu dapat dipantau melalui ikon lonceng pada header navigasi maupun toast di dalam aplikasi.

**Perilaku:**
- Menggunakan aturan tiga tahap pengingat tenggat waktu (**H-3, H-1, dan hari H**) dengan pencatatan kunci unik dan waktu notifikasi (`timestamp`) agar pengingat yang sama tidak muncul berulang.
- Panel ikon lonceng menampilkan **daftar pengingat deadline aktif** di dalam aplikasi beserta pengaturan opsional notifikasi desktop browser.
- Tugas yang sudah berstatus selesai tidak menampilkan pengingat aktif.

---

## Format File CSV

Untuk mengimpor tugas melalui file spreadsheet CSV (Bab 2.9), gunakan format kolom berikut:

```csv
kode_mk,nama_tugas,tanggal_mulai,deadline,kesulitan,status
STSI4440,Proposal Capstone,2026-10-15,2026-10-25,4,Belum
STSI4409,Tugas Metadata,2026-10-16,2026-10-22,3,Sedang
```

- Format tanggal yang didukung: `YYYY-MM-DD` atau `DD/MM/YYYY`.
- Tingkat kesulitan (`kesulitan`): Angka bulat 1 sampai 5.
- Status (`status`): `Belum`, `Sedang`, atau `Selesai` (baris dengan status tidak valid akan ditolak dan ditandai).

---

## Cara Menjalankan Project

1. Pastikan Node.js sudah terpasang di komputer (disarankan versi 18 ke atas).
2. Clone repository dan masuk ke folder project:
   ```bash
   git clone <URL_REPOSITORY>
   cd <NAMA_FOLDER>
   ```
3. Pasang seluruh dependensi:
   ```bash
   npm install
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka alamat lokal yang tampil pada terminal (biasanya `http://localhost:5173`).

---

## Panduan Pengujian / QA (Quality Assurance)

### 1. Menjalankan Automated Unit Tests
Seluruh unit test mencakup 11 berkas pengujian dengan total 102 pengujian unit otomatis yang lulus 100%:
```bash
# Menjalankan seluruh test suite sekali jalan
npm test

# Menjalankan test dalam mode watch (interaktif saat development)
npm run test:watch
```

### 2. Skenario Pengujian Manual (QA Checklist)

| No | Fitur | Skenario Uji | Hasil yang Diharapkan |
|----|-------|--------------|-----------------------|
| 1 | **Tambah Tugas** | Masukkan data valid, klik tombol *Tambah tugas*. | Tugas tersimpan, muncul di daftar teratas/sesuai skor, dan toast konfirmasi muncul. |
| 2 | **Validasi Form** | Kosongkan field wajib atau buat deadline lebih awal dari tanggal mulai. | Muncul pesan error inline di bawah input, form tidak tersubmit. |
| 3 | **Filter Status** | Pilih filter *Belum*, *Sedang*, atau *Selesai*. | Daftar tugas menyaring item sesuai status yang dipilih beserta counter jumlah tugas. |
| 4 | **Filter Matkul & Semester** | Pilih salah satu semester atau mata kuliah pada dropdown di atas daftar tugas. | Hanya tugas dari mata kuliah terpilih yang tampil; dropdown mata kuliah menyesuaikan semester. |
| 5 | **Pencarian Real-Time** | Ketik kata kunci judul, kode, atau nama mata kuliah di kolom pencarian. | Hasil menyaring otomatis seketika dengan teks yang cocok tersorot (highlight kuning). |
| 6 | **Subtugas / Checklist** | Buka accordion subtugas pada kartu tugas, centang/uncheck atau tambah subtugas baru. | Bilah progres terupdate, status tugas induk otomatis menyesuaikan (belum $\to$ sedang $\to$ selesai). |
| 7 | **Ubah Status** | Klik tombol status (Belum $\to$ Sedang $\to$ Selesai) pada kartu tugas. | Status langsung terupdate, jika diubah ke *Selesai* skor menjadi 0 dan tugas berpindah ke bawah. |
| 8 | **Semester Aktif** | Ubah dropdown semester aktif di header (misal: Sem. 4). | Saat membuka form tambah tugas, kelompok Semester 4 berada di urutan teratas dropdown mata kuliah. |
| 9 | **Ekspor CSV & JSON** | Klik menu *Ekspor* di header, pilih *Ekspor ke CSV* atau *Backup Data JSON*. | Berkas terunduh otomatis ke perangkat dengan format nama bertanggal dan struktur valid. |
| 10 | **Cetak Jadwal** | Klik menu *Ekspor* $\to$ *Cetak Jadwal Tugas*. | Halaman rekap tabel tugas terbuka rapi, siap dicetak langsung via printer atau simpan sebagai PDF. |
| 11 | **Import & Restore Data** | Upload file CSV atau file JSON backup pada modal import. | Berkas terdeteksi, preview baris valid tampil, data berhasil dimasukkan ke sistem. |
| 12 | **Tampilan Kalender** | Buka menu *Kalender* di header/navbar. | Event tugas tampil membentang dari tanggal mulai hingga deadline dengan warna sesuai tingkat prioritas. |
| 13 | **Persistensi Data** | Muat data contoh atau tambah tugas, lalu refresh halaman browser (F5). | Seluruh data tugas dan preferensi pengaturan tetap tersimpan rapi di `localStorage`. |
