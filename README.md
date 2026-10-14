# TugasKu — Manajemen Tugas Mahasiswa

Aplikasi web untuk membantu mahasiswa mengelola dan memprioritaskan tugas-tugas perkuliahan. Dilengkapi dengan penghitungan prioritas tugas, visualisasi kalender rentang waktu pengerjaan, impor CSV, serta pengingat deadline berbasis browser. Seluruh data disimpan langsung di browser pengguna menggunakan **localStorage**.

## Fitur Utama

- **Manajemen Tugas Kuliah**: Tambah, ubah, hapus, dan perbarui status tugas (Belum, Sedang, Selesai).
- **Penghitungan Prioritas Tugas**: Mengurutkan tugas secara sistematis berdasarkan kedekatan tenggat waktu (deadline) dan bobot kesulitan tugas.
- **Tampilan Kalender**: Memvisualisasikan rentang pengerjaan tugas dari tanggal mulai hingga deadline menggunakan tampilan kalender interaktif.
- **Impor Data via CSV**: Memudahkan input banyak tugas perkuliahan sekaligus dari file spreadsheet CSV.
- **Notifikasi Pengingat**: Pengingat deadline in-app pada H-3, H-1, dan hari H deadline agar tugas tidak terlewat.
- **Notifikasi Browser (opsional)**: Pengingat yang sama juga dikirim sebagai notifikasi desktop saat tab tidak sedang dilihat (lihat bagian *Notifikasi Browser*).
- **Penyimpanan Lokal**: Aplikasi berjalan di browser tanpa server database eksternal, menyimpan data di localStorage.

## Teknologi yang Digunakan

- **React 18 & Vite**: Framework antarmuka dan build tool cepat.
- **Tailwind CSS**: Styling utilitas yang terstruktur dan responsif.
- **Zustand**: State management untuk data tugas dan riwayat pengingat.
- **FullCalendar**: Komponen kalender jadwal pengerjaan tugas.
- **Lucide React**: Ikon antarmuka modern.
- **Vitest**: Unit testing untuk pengujian logika prioritas, validasi, penanggalan, dan parser CSV.

## Struktur Folder

```
├── public/                 # Aset statis & contoh file CSV
│   ├── favicon.svg
│   └── contoh-tugas.csv
├── src/
│   ├── components/         # Komponen antarmuka pengguna
│   │   ├── calendar/       # Komponen FullCalendar
│   │   ├── layout/         # Header, navigasi, dan shell aplikasi
│   │   ├── notifications/  # Komponen toast notifikasi
│   │   ├── tasks/          # Kartu tugas, form input, modal CSV, filter
│   │   └── ui/             # Komponen reusable (Button, Modal, Field, dll)
│   ├── hooks/              # Custom hooks (useToday, useRankedTasks, useReminders, useHashPage)
│   ├── lib/                # Logika bisnis murni (bebas ketergantungan UI)
│   │   ├── constants.js    # Konstanta status, bobot, dan level
│   │   ├── dates.js        # Utilitas manipulasi tanggal & hitung mundur
│   │   ├── priority.js     # Formula kalkulasi skor prioritas
│   │   ├── csv.js          # Parser dan validator CSV
│   │   ├── reminders.js    # Aturan tahapan pengingat deadline
│   │   ├── sampleTasks.js  # Data dummy untuk demonstrasi
│   │   └── validation.js   # Skema validasi data tugas
│   ├── pages/              # Halaman utama (DashboardPage, CalendarPage)
│   ├── store/              # State store Zustand (taskStore, uiStore, toastStore)
│   ├── App.jsx             # Komponen root aplikasi
│   ├── index.css           # Styling Tailwind dan tema kalender
│   └── main.jsx            # Entry point aplikasi React
├── package.json            # Dependensi dan script project
└── vite.config.js          # Konfigurasi Vite & runner Vitest
```

## Aliran Data Aplikasi

1. **State Penyimpanan (`src/store/taskStore.js`)**:
   Menjadi pusat data tugas yang tersinkronisasi otomatis dengan `localStorage` browser.
2. **Kalkulasi & Hooks (`src/hooks/useRankedTasks.js`)**:
   Membaca daftar tugas dari store, menghitung skor prioritas melalui `src/lib/priority.js`, lalu mengurutkan tugas dari prioritas tertinggi ke terendah.
3. **Komponen Presentasi (`src/pages/` & `src/components/`)**:
   Menerima data yang sudah terurut untuk ditampilkan pada Dashboard maupun Kalender tanpa melakukan mutasi langsung pada data asli.

---

## Logika Penghitungan Prioritas

Skor prioritas dihitung dalam skala 0–100 berdasarkan formula:

$$\text{Skor} = (0.65 \times \text{Urgensi} + 0.35 \times \text{Kesulitan}) \times \text{Pengali Status}$$

- **Urgensi (0–100)**: Dihitung dari sisa hari menuju deadline dengan fungsi peluruhan eksponensial. Tugas hari H atau terlambat bernilai 100.
- **Kesulitan (20–100)**: Dihitung secara proporsional dari skala bobot 1 hingga 5.
- **Pengali Status**: Belum dikerjakan (1.0), Sedang dikerjakan (0.85), Selesai (0).

Level prioritas:
- **Kritis**: Skor $\ge 75$
- **Tinggi**: Skor $\ge 55$
- **Sedang**: Skor $\ge 35$
- **Rendah**: Skor $< 35$

---

## Notifikasi Browser

Diaktifkan lewat ikon lonceng di header (default: nonaktif). Izin baru diminta saat tombol **Aktifkan notifikasi** diklik.

**Perilaku:**
- Memakai aturan pengingat yang sama dengan toast (H-3, H-1, hari H) dan kunci dedup `notified` yang sama, sehingga satu tugas hanya dinotifikasi sekali per tahap dan tidak terkirim ulang setelah halaman di-reload.
- Toast selalu tampil. Notifikasi native **hanya dikirim saat tab tidak sedang dilihat** (`document.visibilityState === 'hidden'`); jika tab terlihat, cukup toast.
- Tugas berstatus selesai atau yang deadline-nya sudah lewat tidak dinotifikasi.
- Maksimum 3 notifikasi sekaligus, diurutkan dari yang paling mendesak; sisanya digabung menjadi satu ringkasan "dan N tugas lainnya".
- Klik notifikasi memfokuskan kembali jendela TugasKu.

**Batasan:** ini memakai Notification API lokal, **bukan Web Push dari server**. Notifikasi hanya muncul selama TugasKu masih terbuka di salah satu tab/jendela browser. Jika browser ditutup, tidak ada pengingat.

**Uji manual (Chrome):**
1. Klik ikon lonceng, lalu **Aktifkan notifikasi** dan pilih *Izinkan*.
2. Klik **Kirim notifikasi uji coba**, lalu pindah ke tab lain/minimize. Ini memastikan izin dan tampilan notifikasi OS berfungsi.
3. Pengingat deadline diproses saat daftar tugas berubah atau saat tanggal berganti (cek tiap ±1 menit). Agar notifikasi native terkirim, tab harus tersembunyi *pada saat itu*, misalnya aplikasi dibiarkan terbuka di tab latar belakang hingga pergantian hari ketika ada tugas dengan deadline H-3/H-1/hari H.
4. Jika kamu menambah tugas sambil melihat tab ini, pengingatnya diproses saat tab terlihat sehingga hanya toast yang muncul (sesuai aturan di atas).

---

## Format File CSV

Untuk mengimpor tugas dalam jumlah banyak, gunakan format kolom CSV berikut:

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

1. Pastikan Node.js sudah terinstal (disarankan versi 18 ke atas).
2. Clone repository dan masuk ke folder project:
   ```bash
   git clone <URL_REPOSITORY>
   cd <NAMA_FOLDER>
   ```
3. Install dependensi:
   ```bash
   npm install
   ```
4. Jalankan development server:
   ```bash
   npm run dev
   ```
5. Buka tautan lokal yang tampil di terminal (biasanya `http://localhost:5173`).

---

## Panduan Pengujian / QA (Quality Assurance)

### 1. Menjalankan Automated Unit Tests
Seluruh unit test mencakup modul kalkulasi prioritas, validasi input, parser CSV, dan utilitas tanggal:
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
| 4 | **Ubah Status** | Klik tombol status (Belum $\to$ Sedang $\to$ Selesai) pada kartu tugas. | Status langsung terupdate, jika diubah ke *Selesai* skor menjadi 0 dan tugas berpindah ke bawah. |
| 5 | **Import CSV** | Upload file `public/contoh-tugas.csv` atau drag-and-drop file CSV. | Tabel preview menampilkan baris valid, klik *Impor* berhasil memasukkan data ke state. |
| 6 | **Tampilan Kalender** | Buka menu *Kalender* di header/navbar. | Event tugas tampil membentang dari tanggal mulai hingga deadline, warna badge sesuai tingkat prioritas. |
| 7 | **Pengingat Deadline** | Tambah tugas dengan deadline hari ini atau 1 hari lagi. | Toast notifikasi peringatan deadline muncul otomatis di sudut layar. |
| 8 | **Persistensi Data** | Muat data contoh atau tambah tugas, lalu refresh halaman browser (F5). | Seluruh data tetap tersimpan rapi tanpa hilang karena tersimpan di `localStorage`. |
