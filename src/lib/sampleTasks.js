import { addDays } from './dates'
import { STATUS } from './constants'

// Data tugas contoh untuk kebutuhan demo dan testing
export function buildSampleTasks(today) {
  const at = (offset) => addDays(today, offset)
  return [
    { courseCode: 'STSI4105', title: 'Laporan Praktikum Basis Data', startDate: at(-6), deadline: at(0), weight: 4, status: STATUS.SEDANG },
    { courseCode: 'STSI4105', title: 'Perancangan ERD Basis Data', startDate: at(-2), deadline: at(5), weight: 3, status: STATUS.BELUM },
    { courseCode: 'STSI4105', title: 'Kuis Query SQL', startDate: at(-12), deadline: at(-2), weight: 2, status: STATUS.SELESAI },
  ]
}
