import { STATUS } from './constants'
import { parseFlexibleDate } from './dates'
import { normalizeTaskInput, validateTask } from './validation'

// Template CSV untuk diunduh pengguna
export const CSV_TEMPLATE = [
  'kode_mata_kuliah,nama_tugas,tanggal_mulai,tanggal_deadline,bobot',
  'IF2101,Laporan Praktikum Basis Data,2026-10-05,2026-10-14,4',
  'MK1102,Resume Jurnal Metodologi,2026-10-08,2026-10-12,2',
].join('\n')

// Variasi nama kolom yang dapat dikenali
const HEADER_ALIASES = {
  courseCode: ['kode_mata_kuliah', 'kode_mk', 'kode_matkul', 'kode', 'matkul', 'course_code', 'course'],
  title: ['nama_tugas', 'tugas', 'nama', 'judul', 'title', 'task'],
  startDate: ['tanggal_mulai', 'tgl_mulai', 'mulai', 'start_date', 'start'],
  deadline: ['tanggal_deadline', 'tgl_deadline', 'deadline', 'tenggat', 'due_date', 'due'],
  weight: ['bobot', 'kesulitan', 'bobot_kesulitan', 'weight'],
  status: ['status'],
}

const REQUIRED_FIELDS = ['courseCode', 'title', 'startDate', 'deadline', 'weight']

const FIELD_LABEL = {
  courseCode: 'kode_mata_kuliah',
  title: 'nama_tugas',
  startDate: 'tanggal_mulai',
  deadline: 'tanggal_deadline',
  weight: 'bobot',
}

const normalizeHeader = (header) =>
  header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

// Cek pemisah kolom (koma, titik koma, atau tab)
function detectDelimiter(text) {
  const firstLine = text.split(/\r?\n/, 1)[0] ?? ''
  const candidates = [',', ';', '\t']
  const count = (char) => firstLine.split(char).length - 1
  return candidates.reduce((best, char) => (count(char) > count(best) ? char : best), ',')
}

// Parse teks CSV menjadi array 2 dimensi (menangani baris baru dan tanda kutip)
export function parseCsv(input, delimiter = detectDelimiter(input)) {
  const text = input.replace(/^\uFEFF/, '')
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') inQuotes = true
    else if (char === delimiter) {
      row.push(cell)
      cell = ''
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i += 1
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
    } else cell += char
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

// Cocokkan header CSV dengan field data tugas
function mapColumns(headerRow) {
  const normalized = headerRow.map(normalizeHeader)
  const columns = {}
  Object.entries(HEADER_ALIASES).forEach(([field, aliases]) => {
    const index = normalized.findIndex((name) => aliases.includes(name))
    if (index !== -1) columns[field] = index
  })
  return columns
}

function parseStatus(value) {
  const text = String(value ?? '').trim().toLowerCase()
  return Object.values(STATUS).includes(text) ? text : STATUS.BELUM
}

// Parse dan validasi seluruh isi baris data dari file CSV
export function parseTasksCsv(text) {
  const result = { valid: [], errors: [], fatal: null }
  const rows = parseCsv(text)

  if (rows.length < 2) {
    result.fatal = 'File kosong atau hanya berisi header. Gunakan template yang tersedia.'
    return result
  }

  const columns = mapColumns(rows[0])
  const missing = REQUIRED_FIELDS.filter((field) => columns[field] === undefined)
  if (missing.length) {
    result.fatal = `Kolom wajib tidak ditemukan: ${missing.map((f) => FIELD_LABEL[f]).join(', ')}.`
    return result
  }

  rows.slice(1).forEach((cells, i) => {
    const cell = (field) => (columns[field] === undefined ? '' : (cells[columns[field]] ?? '').trim())

    const rawDates = { startDate: cell('startDate'), deadline: cell('deadline') }
    const task = normalizeTaskInput({
      courseCode: cell('courseCode'),
      title: cell('title'),
      startDate: parseFlexibleDate(rawDates.startDate) ?? rawDates.startDate,
      deadline: parseFlexibleDate(rawDates.deadline) ?? rawDates.deadline,
      weight: cell('weight'),
      status: parseStatus(cell('status')),
    })

    const errors = validateTask(task)
    const messages = Object.values(errors)
    if (messages.length) result.errors.push({ row: i + 2, messages })
    else result.valid.push(task)
  })

  return result
}
