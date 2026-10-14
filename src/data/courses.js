// Daftar mata kuliah resmi (kode, kode lama/kesetaraan, nama) per semester
const SEMESTERS = {
  1: [
    ['MKWN4101', 'MKWU4101', 'Pendidikan Agama Islam'],
    ['MKWN4109', '', 'Pendidikan Kewarganegaraan'],
    ['STMA4112', 'MATA4101', 'Matematika Dasar'],
    ['STSI4101', 'MSIM4101', 'Pengantar Sistem Informasi'],
    ['STSI4102', 'MSIM4203', 'Algoritma dan Pemrograman'],
    ['STSI4103', 'MSIM4201', 'Sistem Operasi'],
  ],
  2: [
    ['MKDI4201', 'MKWI4201', 'Bahasa Inggris'],
    ['MKKI4201', 'SATS4121', 'Pengantar Statistika'],
    ['MKWN4108', '', 'Bahasa Indonesia'],
    ['MKWN4110', '', 'Pancasila'],
    ['STMA4113', 'MATA4112', 'Aljabar Linear Elementer'],
    ['STSI4104', 'MSIM4202', 'Struktur Data'],
    ['STSI4105', 'MSIM4206', 'Basis Data'],
  ],
  3: [
    ['MKDI4202', 'MKWI4202', 'Belajar di Era Digital'],
    ['STIK4111', 'SATS4111', 'Dasar Pemrograman R'],
    ['STSI4106', 'MSIM4103', 'Logika Informatika'],
    ['STSI4201', '', 'Pemrograman Berbasis Desktop'],
    ['STSI4202', '', 'Rekayasa Perangkat Lunak'],
    ['STSI4203', 'MSIM4208', 'Interaksi Manusia dan Komputer'],
    ['STSI4205', 'MSIM4204', 'Jaringan Komputer'],
  ],
  4: [
    ['EMBS4207', 'EKMA4158', 'Perilaku Organisasi'],
    ['MKDI4203', '', 'Kewirausahaan di Era Digital'],
    ['STSI4204', '', 'Analisis dan Visualisasi Data'],
    ['STSI4206', 'MSIM4205', 'Proses Bisnis'],
    ['STSI4207', 'MSIM4207', 'Sistem Informasi Manajemen'],
    ['STSI4208', '', 'Analisis dan Perancangan Sistem'],
    ['STSI4209', '', 'Pemrograman Berbasis Web'],
  ],
  5: [
    ['EMBS4102', 'EKMA4111', 'Pengantar Bisnis'],
    ['FSAP4102', 'ADPU4341', 'Teori Organisasi'],
    ['FSSI4101', 'BING4102', 'Basic Reading'],
    ['STMA4111', 'MATA4110', 'Kalkulus Diferensial'],
    ['STSI4301', '', 'Sistem Pendukung Keputusan'],
    ['STSI4303', '', 'Pemrograman Berbasis Perangkat Bergerak'],
    ['STSI4308', '', 'Komunikasi Bisnis dan Teknis'],
  ],
  6: [
    ['EMBS4101', 'EKMA4116', 'Manajemen'],
    ['MKKI4301', 'LUHT4353', 'Pemberdayaan Masyarakat'],
    ['STPL4211', '', 'Sistem Informasi Perencanaan'],
    ['STSI4304', '', 'Dasar Infrastruktur TI'],
    ['STSI4305', '', 'Etika Profesi'],
    ['STSI4306', '', 'Arsitektur dan Perancangan Sistem Enterprise'],
    ['STSI4309', '', 'Administrasi Jaringan'],
    ['STSI4310', '', 'Metodologi Penelitian'],
  ],
  7: [
    ['STDA4101', '', 'Pengantar Sains Data'],
    ['STSI4402', '', 'Tata Kelola Teknologi Informasi'],
    ['STSI4403', '', 'Manajemen Resiko dan Audit Sistem Informasi'],
    ['STSI4404', '', 'Keamanan Jaringan'],
    ['STSI4409', '', 'Data Warehouse'],
    ['STSI4440', '', 'Capstone Project'],
  ],
  8: [
    ['EACC4207', '', 'Sistem Informasi Akuntansi'],
    ['STSI4405', '', 'Keamanan Sistem Informasi'],
    ['STSI4406', '', 'Manajemen Proyek Sistem Informasi'],
    ['STSI4407', '', 'Manajemen Layanan Teknologi Informasi'],
    ['STSI4408', '', 'E-Bisnis'],
  ],
  Kesetaraan: [
    ['MKWU4108', 'MKWN4108', 'Bahasa Indonesia'],
    ['MKWU4109', 'MKWN4109', 'Pendidikan Kewarganegaraan'],
  ],
}

export const COURSES = Object.entries(SEMESTERS).flatMap(([group, rows]) =>
  rows.map(([code, altCode, name]) => ({
    code,
    altCode,
    name,
    semester: group,
    groupLabel: Number.isNaN(Number(group)) ? `Mata Kuliah ${group}` : `Semester ${group}`,
  })),
)

// Cari mata kuliah berdasarkan kode utama atau kode lama
export function findCourse(code) {
  const key = String(code ?? '').trim().toUpperCase()
  if (!key) return undefined
  return COURSES.find((c) => c.code === key || c.altCode === key)
}
