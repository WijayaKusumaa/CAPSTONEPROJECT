import { MAX_WEIGHT, MIN_WEIGHT, STATUS } from './constants'
import { diffInDays, parseISODate } from './dates'
import { MAX_SUBTASKS, normalizeSubtasks } from './subtasks'

const STATUS_ALIASES = {
  belum: STATUS.BELUM,
  'belum dikerjakan': STATUS.BELUM,
  sedang: STATUS.SEDANG,
  'sedang dikerjakan': STATUS.SEDANG,
  selesai: STATUS.SELESAI,
  'telah selesai': STATUS.SELESAI,
}

// Mengenali nilai status secara case-insensitive (mengembalikan null jika tidak valid)
export function parseStatusValue(value) {
  const text = String(value ?? '').trim().toLowerCase()
  if (!text) return STATUS.BELUM
  return STATUS_ALIASES[text] ?? null
}

// Merapikan nilai input dari form dan file CSV
export function normalizeTaskInput(input) {
  const parsedStatus = parseStatusValue(input.status)
  return {
    courseCode: String(input.courseCode ?? '').trim().toUpperCase(),
    title: String(input.title ?? '').trim(),
    startDate: String(input.startDate ?? '').trim(),
    deadline: String(input.deadline ?? '').trim(),
    weight: Number(input.weight),
    status: parsedStatus ?? STATUS.BELUM,
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
  if (!weightOk) errors.weight = `Tingkat kesulitan harus angka bulat ${MIN_WEIGHT}–${MAX_WEIGHT}.`

  const hasRawStatus = task.rawStatus !== undefined && String(task.rawStatus).trim() !== ''
  if ((hasRawStatus && !parseStatusValue(task.rawStatus)) || !Object.values(STATUS).includes(task.status)) {
    errors.status = 'Status harus Belum, Sedang, atau Selesai.'
  }

  if (Array.isArray(task.rawSubtasks) && task.rawSubtasks.length > MAX_SUBTASKS) {
    errors.subtasks = `Maksimal ${MAX_SUBTASKS} subtugas per tugas.`
  }

  return errors
}
