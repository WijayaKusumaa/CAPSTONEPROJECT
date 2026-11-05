import { parseFlexibleDate } from './dates'
import { normalizeTaskInput, parseStatusValue, validateTask } from './validation'

// Template CSV sesuai Bab 2.9 Laporan Kemajuan Capstone Project STSI4440
export const CSV_TEMPLATE = [
  'kode_mk,nama_tugas,tanggal_mulai,deadline,kesulitan,status',
  'STSI4440,Proposal Capstone,2026-10-15,2026-10-25,4,Belum',
  'STSI4409,Tugas Metadata,2026-10-16,2026-10-22,3,Sedang',
].join('\n')

// Variasi nama kolom yang dapat dikenali (mendukung format resmi kode_mk maupun kode_mata_kuliah)
const HEADER_ALIASES = {
  courseCode: ['kode_mk', 'kode_mata_kuliah', 'kode_matkul', 'kode', 'matkul', 'course_code', 'course'],
  title: ['nama_tugas', 'tugas', 'nama', 'judul', 'title', 'task'],
  startDate: ['tanggal_mulai', 'tgl_mulai', 'mulai', 'start_date', 'start'],
  deadline: ['deadline', 'tanggal_deadline', 'tgl_deadline', 'tenggat', 'due_date', 'due'],
  weight: ['kesulitan', 'tingkat_kesulitan', 'bobot', 'bobot_kesulitan', 'weight'],
  status: ['status'],
}

const REQUIRED_FIELDS = ['courseCode', 'title', 'startDate', 'deadline', 'weight']

const FIELD_LABEL = {
  courseCode: 'kode_mk',
  title: 'nama_tugas',
  startDate: 'tanggal_mulai',
  deadline: 'deadline',
  weight: 'kesulitan',
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
  return parseStatusValue(value) ?? value
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
    const rawStatus = cell('status')
    const task = normalizeTaskInput({
      courseCode: cell('courseCode'),
      title: cell('title'),
      startDate: parseFlexibleDate(rawDates.startDate) ?? rawDates.startDate,
      deadline: parseFlexibleDate(rawDates.deadline) ?? rawDates.deadline,
      weight: cell('weight'),
      status: parseStatus(rawStatus),
    })

    const errors = validateTask({ ...task, rawStatus })
    const messages = Object.values(errors)
    if (messages.length) result.errors.push({ row: i + 2, messages })
    else result.valid.push(task)
  })

  return result
}
