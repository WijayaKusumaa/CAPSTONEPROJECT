import { addDays } from './dates'
import { STATUS } from './constants'

// Data tugas contoh sesuai ilustrasi Tabel 2.3 & Bab 2.9 Tugas 2 Capstone Project STSI4440
export function buildSampleTasks(today) {
  const at = (offset) => addDays(today, offset)
  return [
    { courseCode: 'STSI4440', title: 'Proposal & Laporan Kemajuan Capstone', startDate: at(-5), deadline: at(2), weight: 4, status: STATUS.BELUM },
    { courseCode: 'STSI4105', title: 'Laporan Praktikum Basis Data', startDate: at(-4), deadline: at(1), weight: 2, status: STATUS.BELUM },
    { courseCode: 'STSI4209', title: 'Proyek Pemrograman Berbasis Web', startDate: at(-3), deadline: at(6), weight: 5, status: STATUS.SEDANG },
    { courseCode: 'STSI4409', title: 'Tugas Metadata Data Warehouse', startDate: at(-2), deadline: at(12), weight: 5, status: STATUS.BELUM },
    { courseCode: 'MKKI4201', title: 'Kuis Pengantar Statistika', startDate: at(-10), deadline: at(-2), weight: 2, status: STATUS.SELESAI },
  ]
}
