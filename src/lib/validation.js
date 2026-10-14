import { MAX_WEIGHT, MIN_WEIGHT, STATUS } from './constants'
import { diffInDays, parseISODate } from './dates'
import { MAX_SUBTASKS, normalizeSubtasks } from './subtasks'

// Merapikan nilai input dari form dan file CSV
export function normalizeTaskInput(input) {
  return {
    courseCode: String(input.courseCode ?? '').trim().toUpperCase(),
    title: String(input.title ?? '').trim(),
    startDate: String(input.startDate ?? '').trim(),
    deadline: String(input.deadline ?? '').trim(),
    weight: Number(input.weight),
    status: Object.values(STATUS).includes(input.status) ? input.status : STATUS.BELUM,
    subtasks: normalizeSubtasks(input.subtasks),
  }
}

// Validasi data input tugas untuk form manual dan CSV import
export function validateTask(task) {
  const errors = {}

  if (!task.courseCode) errors.courseCode = 'Kode mata kuliah wajib diisi.'
  if (!task.title) errors.title = 'Nama tugas wajib diisi.'

  if (!parseISODate(task.startDate)) errors.startDate = 'Tanggal mulai tidak valid.'
  if (!parseISODate(task.deadline)) errors.deadline = 'Tanggal deadline tidak valid.'

  if (!errors.startDate && !errors.deadline && diffInDays(task.startDate, task.deadline) < 0) {
    errors.deadline = 'Deadline tidak boleh sebelum tanggal mulai.'
  }

  const weightOk =
    Number.isInteger(task.weight) && task.weight >= MIN_WEIGHT && task.weight <= MAX_WEIGHT
  if (!weightOk) errors.weight = `Bobot harus angka bulat ${MIN_WEIGHT}–${MAX_WEIGHT}.`

  if (Array.isArray(task.rawSubtasks) && task.rawSubtasks.length > MAX_SUBTASKS) {
    errors.subtasks = `Maksimal ${MAX_SUBTASKS} subtugas per tugas.`
  }

  return errors
}
