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

- **React 18 & Vite**: Framework antarmuka dan build tool modern.
- **Tailwind CSS**: Desain utilitas yang terstruktur dan responsif.
- **Zustand**: Manajemen *state* untuk data tugas, preferensi pengaturan, dan notifikasi.
- **FullCalendar**: Komponen kalender jadwal pengerjaan tugas.
- **Lucide React**: Kumpulan ikon antarmuka modern.
- **Vitest**: Unit testing untuk pengujian logika prioritas, validasi, penanggalan, parser CSV, ekspor, pencarian, dan subtugas.

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

Skor prioritas dihitung dalam skala 0–100 berdasarkan formula:

$$\text{Skor} = (0.65 \times \text{Urgensi} + 0.35 \times \text{Kesulitan}) \times \text{Pengali Status}$$

- **Urgensi (0–100)**: Dihitung dari sisa hari menuju deadline dengan fungsi peluruhan eksponensial. Tugas yang jatuh tempo hari ini atau terlambat bernilai 100.
- **Kesulitan (20–100)**: Dihitung secara proporsional dari skala bobot 1 hingga 5.
- **Pengali Status**: Belum dikerjakan (1.0), Sedang dikerjakan (0.85), Selesai (0).

Level prioritas:
- **Kritis**: Skor $\ge 75$
- **Tinggi**: Skor $\ge 55$
- **Sedang**: Skor $\ge 35$
- **Rendah**: Skor $< 35$

---

## Notifikasi Browser

Pengingat tenggat waktu dapat diaktifkan melalui ikon lonceng pada header navigasi.

**Perilaku:**
- Menggunakan aturan pengingat tenggat waktu (H-3, H-1, dan hari H) dengan kunci deduplikasi unik agar satu tugas tidak memicu notifikasi berulang.
- Notifikasi desktop hanya dikirimkan saat tab aplikasi sedang berada di latar belakang (*hidden*). Jika tab sedang aktif dilihat, notifikasi cukup ditampilkan melalui toast di dalam aplikasi.
- Tugas yang sudah berstatus selesai atau tanggal tenggatnya telah terlewat tidak akan dinotifikasi.
- Sistem membatasi maksimal 3 notifikasi sekaligus untuk menghindari penumpukan di layar pengguna.

---

## Format File CSV

Untuk mengimpor tugas melalui file spreadsheet CSV, gunakan format kolom berikut:

```csv
kode_mata_kuliah,nama_tugas,tanggal_mulai,tanggal_deadline,bobot
STSI4105,Laporan Praktikum Basis Data,2026-10-05,2026-10-14,4
STSI4310,Resume Jurnal Metodologi Penelitian,2026-10-08,2026-10-12,2
```

- Format tanggal yang didukung: `YYYY-MM-DD` atau `DD/MM/YYYY`.
- Bobot: Angka bulat 1 sampai 5.
- Kolom status bersifat opsional (`belum`, `sedang`, `selesai`).

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
Seluruh unit test mencakup 11 berkas pengujian dengan total 97 pengujian unit otomatis:
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
