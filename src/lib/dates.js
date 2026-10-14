// Utilitas pengolahan tanggal (format YYYY-MM-DD)
const MS_PER_DAY = 86_400_000
const LOCALE = 'id-ID'

const pad = (n) => String(n).padStart(2, '0')

// Konversi objek Date ke format YYYY-MM-DD lokal
export function toISODate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

// Parse string YYYY-MM-DD menjadi objek Date lokal
export function parseISODate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value ?? '').trim())
  if (!match) return null
  const [, y, m, d] = match.map(Number)
  const date = new Date(y, m - 1, d)
  const valid = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d
  return valid ? date : null
}

// Parsing tanggal fleksibel untuk input CSV (mendukung YYYY-MM-DD dan DD-MM-YYYY)
export function parseFlexibleDate(value) {
  const text = String(value ?? '').trim()
  if (!text) return null

  const ymd = /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/.exec(text)
  const dmy = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(text)
  const parts = ymd ? [ymd[1], ymd[2], ymd[3]] : dmy ? [dmy[3], dmy[2], dmy[1]] : null
  if (!parts) return null

  const iso = `${parts[0]}-${pad(parts[1])}-${pad(parts[2])}`
  return parseISODate(iso) ? iso : null
}

// Menghitung selisih hari antar dua tanggal (b - a)
export function diffInDays(fromISO, toISO) {
  const a = parseISODate(fromISO)
  const b = parseISODate(toISO)
  if (!a || !b) return NaN
  return Math.round(
    (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) -
      Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
      MS_PER_DAY,
  )
}

export function addDays(iso, amount) {
  const date = parseISODate(iso)
  if (!date) return null
  date.setDate(date.getDate() + amount)
  return toISODate(date)
}

export function formatDate(iso, options = { day: 'numeric', month: 'short' }) {
  const date = parseISODate(iso)
  return date ? new Intl.DateTimeFormat(LOCALE, options).format(date) : '-'
}

export function formatRange(startISO, endISO) {
  return `${formatDate(startISO)} – ${formatDate(endISO, { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export function formatLongToday(iso) {
  return formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

// Keterangan sisa hari untuk tampilan kartu tugas
export function describeCountdown(daysLeft) {
  if (Number.isNaN(daysLeft)) return '-'
  if (daysLeft < 0) return `Terlambat ${Math.abs(daysLeft)} hari`
  if (daysLeft === 0) return 'Hari ini'
  if (daysLeft === 1) return 'Besok'
  return `${daysLeft} hari lagi`
}
