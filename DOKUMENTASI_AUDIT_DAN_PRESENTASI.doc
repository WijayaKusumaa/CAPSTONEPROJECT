# PANDUAN LENGKAP APLIKASI WEB "TUGASKU"
**Sistem Manajemen Tugas Kuliah & Urutan Prioritas Otomatis**  
*Mata Kuliah: STSI4440 Capstone Project - Sistem Informasi, Universitas Terbuka (Kelompok C)*

Dokumen ini ditulis dengan **bahasa yang sederhana dan santai** agar mudah dimengerti oleh semua anggota kelompok (bahkan yang awam IT sekalipun). Dokumen ini menjelaskan:
1. Cara kerja aplikasi secara umum.
2. Cara aplikasi menentukan tugas mana yang harus dikerjakan duluan.
3. Struktur file di proyek ini (biar tahu kalau ditanya file apa saja isinya).
4. Contekan presentasi (slide demi slide + kata-kata/skrip bicara di depan dosen).
5. Jawaban siap pakai untuk pertanyaan dosen saat sidang/tanya jawab.

---

## 1. PENJELASAN SEDERHANA: BAGAIMANA APLIKASI INI BEKERJA?

Bayangkan aplikasi ini seperti **"Asisten Pribadi Mahasiswa"** untuk mengatur semua tugas kuliah agar tidak ada yang kelupaan atau telat dikumpulkan.

Alur pemakaiannya sangat mudah, hanya ada 4 langkah:
1. **Masukkan Tugas:**  
   Mahasiswa bisa memasukkan tugas lewat formulir di layar, atau langsung mengunggah file spreadsheet Excel/CSV jika punya jadwal tugas banyak sekaligus. Data yang dimasukkan: Kode Mata Kuliah, Nama Tugas, Tanggal Mulai, Tanggal Deadline, dan Tingkat Kesulitan (skala 1 sampai 5).
2. **Sistem Menghitung Otomatis:**  
   Sistem langsung menghitung "Skor Prioritas" (nilai 20 sampai 100). Tugas yang paling mendesak dan sulit akan otomatis ditaruh di urutan paling atas.
3. **Melihat Jadwal di Kalender & Dashboard:**  
   Mahasiswa bisa melihat daftar tugas yang sudah berurutan rapi, ringkasan progres belajar, dan tampilan kalender visual yang menunjukkan rentang waktu pengerjaan tugas dari awal sampai batas pengumpulan.
4. **Mendapatkan Pengingat & Update Status:**  
   Jika ada tugas yang tinggal 3 hari lagi (H-3), besok (H-1), atau hari ini (Hari H), aplikasi akan memunculkan alarm/notifikasi pengingat. Jika tugas sudah selesai, mahasiswa tinggal klik status **"Selesai"**, tugas akan turun ke bawah dan pengingatnya otomatis mati.

---

## 2. CARA MENJELASKAN RUMUS PRIORITAS (TANPA BAHASA TEKNIS)

Dosen pasti akan bertanya: *"Bagaimana aplikasi tahu tugas mana yang nomor satu?"*

Jawabannya: **Sistem memakai rumus matematika adil bernama SAW (Penjumlahan Berbobot).**  
Rumusnya sangat gampang:

$$\text{Nilai Prioritas} = (60\% \times \text{Urgensi Waktu}) + (40\% \times \text{Tingkat Kesulitan})$$

Kenapa rumusnya begini?
- **Urgensi Waktu (Porsi 60%):**  
  Tenggat waktu adalah yang paling gawat. Semakin dekat hari pengumpulan, nilainya semakin tinggi (kelipatan 20):
  - Masih lebih dari 2 minggu lagi = Nilai 20
  - Tinggal 1 sampai 2 minggu lagi = Nilai 40
  - Tinggal 4 sampai 7 hari lagi = Nilai 60
  - Tinggal 2 sampai 3 hari lagi (H-3) = Nilai 80
  - Tinggal besok atau hari ini (H-1 & Hari H) = Nilai 100
- **Tingkat Kesulitan (Porsi 40%):**  
  Kesulitan dinilai dari angka 1 sampai 5:
  - 1 (Sangat Mudah) = Nilai 20
  - 2 (Mudah) = Nilai 40
  - 3 (Sedang) = Nilai 60
  - 4 (Sulit) = Nilai 80
  - 5 (Sangat Sulit) = Nilai 100

### Contoh Nyata (Persis seperti contoh di laporan Tugas 2):
Misal ada 2 tugas:
- **Tugas A (Laporan Skripsi):** Deadline tinggal **2 hari lagi** (Urgensi = 80), Kesulitan **tingkat 4** (Kesulitan = 80).  
  $\text{Skor} = (0,6 \times 80) + (0,4 \times 80) = 48 + 32 = \mathbf{80}$.
- **Tugas B (Resume Jurnal):** Deadline tinggal **1 hari lagi/besok** (Urgensi = 100), tapi mudah cuma **tingkat 2** (Kesulitan = 40).  
  $\text{Skor} = (0,6 \times 100) + (0,4 \times 40) = 60 + 16 = \mathbf{76}$.

**Hasilnya:** Tugas A otomatis ditaruh di nomor 1 karena skornya 80, sedangkan Tugas B nomor 2 karena skornya 76. Adil, transparan, dan tidak asal tebak!

---

## 3. ARSITEKTUR APLIKASI: KENAPA PAKAI `localStorage`?

Jika dosen bertanya: *"Aplikasi ini pakai database apa di internet? Kok tidak pakai MySQL?"*

Jawabannya:
1. **Aplikasi Pribadi (Personal Tool):** Aplikasi ini dirancang untuk pemakaian pribadi mahasiswa masing-masing. Mahasiswa tidak perlu registrasi akun atau login yang ribet. Begitu web dibuka di HP atau laptop, langsung bisa dipakai detik itu juga.
2. **Sangat Cepat & Tanpa Biaya:** Karena semua data disimpan di memori peramban/browser perangkat masing-masing (`localStorage`), aplikasi bekerja sangat cepat tanpa loading internet sama sekali (zero-latency).
3. **Ada Fitur Cadangan Data (Backup):** Jika mahasiswa mau ganti laptop atau membersihkan browser, mereka tinggal klik tombol **Ekspor CSV** atau **Backup Data**. Nanti filenya bisa di-upload kembali ke perangkat yang baru tanpa takut data hilang.

---

## 4. PENJELASAN STRUKTUR FILE (UNTUK ANGGOTA KELOMPOK)

Biar teman-teman tidak bingung melihat folder kodingan, ini ringkasannya:

- `src/lib/priority.js` $\to$ Berisi rumus matematika perhitungan skor prioritas tadi.
- `src/lib/validation.js` $\to$ Penjaga pintu: memastikan nama tugas tidak kosong dan tanggal deadline tidak terbalik.
- `src/lib/csv.js` $\to$ Mesin pembaca file CSV/Excel saat mahasiswa melakukan impor tugas.
- `src/lib/reminders.js` $\to$ Pengatur jadwal pengingat (H-3, H-1, dan hari H).
- `src/store/taskStore.js` $\to$ Tempat penyimpanan data tugas ke memori browser (`localStorage`).
- `src/pages/DashboardPage.jsx` $\to$ Halaman utama yang menampilkan daftar tugas berurutan dan kartu ringkasan.
- `src/pages/CalendarPage.jsx` $\to$ Halaman tampilan kalender visual.
- `src/components/` $\to$ Komponen tampilan kecil (tombol, formulir, kartu tugas, lonceng notifikasi).

---

## 5. BAHAN PRESENTASI (SLIDE BY SLIDE + SKRIP BICARA)

Tinggal salin tulisan di bawah ini ke slide PPT kalian, dan baca **Skrip Bicara** saat latihan:

---

### SLIDE 1: Alur Kerja Aplikasi (Workflow)
**Tampilan di Layar:**
- **Tambah Tugas Mudah:** Lewat formulir manual atau unggah file spreadsheet CSV.
- **Pengecekan Otomatis:** Menjaga agar tanggal deadline tidak mendahului tanggal mulai.
- **Perhitungan Otomatis:** Menghitung skor prioritas seketika saat tugas disimpan.
- **Dua Tampilan Utama:** Tampilan Daftar Prioritas (Dashboard) dan Rentang Waktu (Kalender).
- **Pengingat Deadline:** Peringatan berkala pada H-3, H-1, dan hari H.

**Skrip Bicara yang Dibaca:**
> *"Selamat pagi/siang Bapak dan Ibu dosen penguji. Pada slide ini saya ingin menjelaskan alur pemakaian aplikasi TugasKu.*
>
> *Alurnya sangat sederhana:*
> *Pertama, mahasiswa memasukkan data tugas, baik diketik manual lewat form atau langsung diunggah lewat file CSV jika punya jadwal banyak.*
> *Kedua, sistem otomatis memeriksa datanya agar tidak ada tanggal yang terbalik atau kolom penting yang terlewat.*
> *Ketiga, sistem langsung menghitung nilai urgensi dan tingkat kesulitan tugas tersebut.*
> *Keempat, tugas langsung ditampilkan berurutan dari yang paling penting di Dashboard dan Kalender, lengkap dengan pengingat otomatis di H-3, H-1, dan hari H.*
> *Terakhir, saat tugas sudah selesai dikerjakan, mahasiswa tinggal klik tombol Selesai, dan status progres akan langsung terupdate."*

---

### SLIDE 2: Cara Kerja Logika Prioritas
**Tampilan di Layar:**
- **Metode SAW (Simple Additive Weighting):** Menjumlahkan nilai kriteria sesuai bobot kepentingannya.
- **Rumus:** $\text{Skor Prioritas} = (60\% \times \text{Urgensi Waktu}) + (40\% \times \text{Tingkat Kesulitan})$
- **Rentang Nilai:** 20 sampai 100 poin.
- **Aturan Tambahan:** Jika dua tugas mendapat skor yang sama persis, tugas yang deadlinenya lebih dekat akan selalu didahulukan.

**Skrip Bicara yang Dibaca:**
> *"Bagaimana sistem kami menentukan urutan tugas? Kami menggunakan metode pengambilan keputusan bernama Simple Additive Weighting atau SAW.*
>
> *Rumusnya menggabungkan dua hal: sisa waktu atau urgensi kami beri bobot 60 persen, dan tingkat kesulitan tugas kami beri bobot 40 persen. Mengapa urgensi lebih besar? Karena tenggat waktu adalah faktor yang paling sering memicu mahasiswa terlambat mengumpulkan tugas.*
>
> *Seluruh perhitungan ini transparan. Di setiap kartu tugas, mahasiswa bisa melihat nilai rinciannya sehingga mereka tahu pasti alasan mengapa tugas tersebut harus didahulukan. Rumus ini juga sudah kami buktikan dan hasilnya persis dengan contoh perhitungan manual di dokumen laporan Tugas 2."*

---

### SLIDE 3: Arsitektur Client-Side & `localStorage`
**Tampilan di Layar:**
- **Teknologi:** React 18, Tailwind CSS, Zustand, dan FullCalendar.
- **Penyimpanan Lokal:** Memanfaatkan `localStorage` di peramban pengguna.
- **Keuntungan:** Tanpa perlu login/akun, aplikasi sangat ringan, respon instan, dan bebas biaya server.
- **Keamanan Data:** Dilengkapi fitur Ekspor CSV dan File Cadangan (JSON Backup).

**Skrip Bicara yang Dibaca:**
> *"Terkait arsitektur aplikasi, TugasKu berjalan sepenuhnya di sisi peramban web pengguna dan memanfaatkan penyimpanan lokal browser atau localStorage.*
>
> *Keputusan ini diambil karena aplikasi ini dirancang khusus untuk penggunaan individual mahasiswa. Pengguna tidak perlu repot membuat akun atau login, sehingga aplikasi bisa langsung dipakai dengan cepat.*
>
> *Karena semua data diolah di laptop/HP mahasiswa sendiri, aplikasi ini bekerja seketika tanpa perlu menunggu jaringan internet. Untuk mengantisipasi jika pengguna ingin berganti perangkat atau membersihkan browser, kami sudah melengkapinya dengan tombol Ekspor CSV dan Backup JSON untuk memindahkan data kapan saja."*

---

### SLIDE 4: Pengujian Sistem (14 Skenario Black-Box)
**Tampilan di Layar:**
- **Metode Pengujian:** *Black-Box Testing* (menguji fungsi fitur dari sisi pengguna).
- **Cakupan Pengujian:**
  1. Input, Edit, dan Hapus Tugas $\to$ Berhasil
  2. Validasi Tanggal Terbalik & Kolom Kosong $\to$ Berhasil
  3. Impor File CSV & Penolakan Data Rusak $\to$ Berhasil
  4. Perhitungan Skor Prioritas Sesuai Rumus $\to$ Berhasil
  5. Kalender Rentang Tanggal Mulai s/d Deadline $\to$ Berhasil
  6. Pengingat H-3, H-1, dan Hari H $\to$ Berhasil
  7. Perubahan Status Selesai $\to$ Berhasil
- **Hasil Akhir:** 14 dari 14 Skenario Berjalan Sempurna (**100% Berhasil**), didukung 102 unit test otomatis.

**Skrip Bicara yang Dibaca:**
> *"Untuk memastikan seluruh fungsi aplikasi berjalan sesuai dengan bab perencanaan di Tugas 2, kami melakukan pengujian Black-Box terhadap 14 skenario pengujian utama, ditambah 102 pengujian unit otomatis.*
>
> *Mulai dari pengujian formulir tugas, penolakan baris CSV yang salah format, ketepatan rumus prioritas, sinkronisasi kalender, hingga munculnya notifikasi pengingat pada H-3, H-1, dan hari H.*
>
> *Seluruh 14 skenario pengujian tersebut telah kami jalankan dan hasilnya 100 persen berhasil tanpa ada kendala. Aplikasi terbukti siap digunakan dan sudah memenuhi seluruh spesifikasi rancangan."*

---

## 6. JAWABAN CEPAT KALAU DITANYA DOSEN (ANTI BLANK)

1. **Dosen:** *"Kenapa rumusnya tidak pakai kecerdasan buatan (AI) saja?"*  
   **Jawaban:**  
   *"Karena penentuan prioritas tugas harian membutuhkan logika yang jelas, pasti, dan transparan bagi mahasiswa. Dengan rumus matematika berbobot ini, mahasiswa bisa menghitung ulang dan percaya pada alasannya, sedangkan AI bersifat tertutup (black-box) dan membutuhkan data latih yang sangat besar."*

2. **Dosen:** *"Kalau aplikasinya tidak dibuka pas H-3, pengingatnya hilang dong?"*  
   **Jawaban:**  
   *"Tidak hilang, Bu/Pak. Logika kode pengingat kami buat cerdas: jika mahasiswa baru sempat buka aplikasi di H-2, sistem akan mendeteksi bahwa pengingat tahap H-3 belum pernah muncul, dan pengingatnya akan tetap ditampilkan di panel notifikasi."*

3. **Dosen:** *"Bagaimana kalau dua tugas deadlinenya sama dan kesulitannya sama?"*  
   **Jawaban:**  
   *"Sistem kami memiliki aturan seri berlapis: jika skor sama, dilihat mana yang deadlinenya lebih dekat; jika tanggalnya juga persis sama, sistem akan mengurutkannya secara konsisten berdasarkan abjad nama tugas."*
