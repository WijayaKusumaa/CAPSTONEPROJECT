import { toISODate } from './dates'
import { normalizeTaskInput, validateTask } from './validation'

// Escape nilai cell CSV sesuai standar RFC 4180
function escapeCsvCell(value) {
  const str = String(value ?? '')
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

// Konversi daftar tugas ke CSV dengan format identik dengan import + status
export function tasksToCsv(tasks) {
  const headers = ['kode_mata_kuliah', 'nama_tugas', 'tanggal_mulai', 'tanggal_deadline', 'bobot', 'status']
  const rows = [headers.join(',')]

  for (const task of tasks) {
    const row = [
      escapeCsvCell(task.courseCode),
      escapeCsvCell(task.title),
      escapeCsvCell(task.startDate),
      escapeCsvCell(task.deadline),
      escapeCsvCell(task.weight),
      escapeCsvCell(task.status ?? 'belum'),
    ]
    rows.push(row.join(','))
  }

  // Tambahkan UTF-8 BOM (\uFEFF) agar terbaca sempurna di Microsoft Excel
  return `\uFEFF${rows.join('\n')}\n`
}

// Konversi data ke format JSON Backup
export function tasksToBackupJson(tasks) {
  const payload = {
    app: 'tugasku',
    version: 1,
    exportedAt: new Date().toISOString(),
    tasks: tasks.map((t) => ({
      courseCode: t.courseCode,
      title: t.title,
      startDate: t.startDate,
      deadline: t.deadline,
      weight: t.weight,
      status: t.status,
      ...(t.subtasks ? { subtasks: t.subtasks } : {}),
    })),
  }
  return JSON.stringify(payload, null, 2)
}

// Parse dan validasi file JSON Backup
export function parseBackupJson(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    return { tasks: [], errors: ['Format file JSON tidak valid atau rusak.'], fatal: 'File bukan JSON yang valid.' }
  }

  if (!parsed || typeof parsed !== 'object' || parsed.app !== 'tugasku') {
    return {
      tasks: [],
      errors: ['File bukan berkas backup TugasKu.'],
      fatal: 'File ini bukan berkas backup resmi TugasKu.',
    }
  }

  if (!Array.isArray(parsed.tasks)) {
    return {
      tasks: [],
      errors: ['Struktur backup tidak memiliki daftar tugas yang valid.'],
      fatal: 'Data tugas tidak ditemukan dalam berkas backup.',
    }
  }

  const valid = []
  const errors = []

  parsed.tasks.forEach((item, index) => {
    const normalized = normalizeTaskInput(item)
    // Jika ada subtasks bawaan
    if (Array.isArray(item.subtasks)) {
      normalized.subtasks = item.subtasks
    }
    const taskErrors = validateTask(normalized)
    const messages = Object.values(taskErrors)

    if (messages.length > 0) {
      errors.push({ row: index + 1, messages })
    } else {
      valid.push(normalized)
    }
  })

  return { tasks: valid, errors, fatal: null }
}

// Format nama file unduhan (misal: tugasku-2026-10-14.csv)
export function buildExportFilename(prefix = 'tugasku', ext = 'csv', date = toISODate()) {
  const cleanExt = ext.replace(/^\./, '')
  return `${prefix}-${date}.${cleanExt}`
}
