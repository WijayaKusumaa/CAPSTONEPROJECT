import { findCourse } from '../data/courses'
import { STATUS } from './constants'

export const MAX_SUBTASKS = 20
export const MAX_SUBTASK_TITLE_LENGTH = 80

export const createSubtaskId = () =>
  globalThis.crypto?.randomUUID?.() ?? `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

// Normalisasi list subtugas
export function normalizeSubtasks(raw = []) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((st, idx) => {
      if (!st || typeof st !== 'object') return null
      const title = String(st.title ?? '').trim().slice(0, MAX_SUBTASK_TITLE_LENGTH)
      if (!title) return null
      return {
        id: String(st.id ?? `sub-${idx + 1}-${createSubtaskId().slice(-5)}`),
        title,
        done: Boolean(st.done),
      }
    })
    .filter(Boolean)
    .slice(0, MAX_SUBTASKS)
}

// Menghitung progres subtugas { done, total, percent }
export function progressOf(task) {
  const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : []
  const total = subtasks.length
  if (total === 0) return { done: 0, total: 0, percent: 0 }

  const done = subtasks.filter((s) => Boolean(s.done)).length
  const percent = Math.round((done / total) * 100)
  return { done, total, percent }
}

// Sinkronisasi status tugas induk dengan kondisi subtugas
export function syncStatusWithSubtasks(task) {
  const subtasks = Array.isArray(task?.subtasks) ? task.subtasks : []
  if (subtasks.length === 0) return task

  const total = subtasks.length
  const done = subtasks.filter((s) => Boolean(s.done)).length

  let nextStatus = task.status ?? STATUS.BELUM

  if (done === total) {
    // Semua subtugas selesai -> tugas induk otomatis selesai
    nextStatus = STATUS.SELESAI
  } else if (done > 0) {
    // Ada yang selesai tapi belum semua: jika 'belum' atau 'selesai' -> ubah jadi 'sedang'
    if (task.status === STATUS.BELUM || task.status === STATUS.SELESAI) {
      nextStatus = STATUS.SEDANG
    }
  } else if (done === 0) {
    // Jika semua belum selesai tapi status induk 'selesai' (misal baru di-uncheck) -> turunkan ke 'sedang'
    if (task.status === STATUS.SELESAI) {
      nextStatus = STATUS.SEDANG
    }
  }

  return { ...task, status: nextStatus }
}

// Logika migrasi store taskStore ke Version 3
export function migrateStoreV2ToV3(state) {
  const rawTasks = Array.isArray(state?.tasks) ? state.tasks : []
  return {
    ...state,
    tasks: rawTasks
      .filter((t) => findCourse(t?.courseCode)) // Pertahankan migrasi v2 (buang kode matkul tidak dikenal)
      .map((t) => ({
        ...t,
        subtasks: Array.isArray(t.subtasks) ? normalizeSubtasks(t.subtasks) : [],
      })),
  }
}
