import { describe, expect, it } from 'vitest'
import { STATUS } from './constants'
import {
  MAX_SUBTASKS,
  MAX_SUBTASK_TITLE_LENGTH,
  migrateStoreV2ToV3,
  normalizeSubtasks,
  progressOf,
  syncStatusWithSubtasks,
} from './subtasks'

describe('subtasks.js', () => {
  describe('progressOf', () => {
    it('mengembalikan 0 untuk tugas tanpa subtugas atau list kosong', () => {
      expect(progressOf({})).toEqual({ done: 0, total: 0, percent: 0 })
      expect(progressOf({ subtasks: [] })).toEqual({ done: 0, total: 0, percent: 0 })
    })

    it('menghitung progres dan persentase dengan pembulatan yang benar', () => {
      const task = {
        subtasks: [
          { id: '1', title: 'A', done: true },
          { id: '2', title: 'B', done: false },
          { id: '3', title: 'C', done: false },
        ],
      }
      expect(progressOf(task)).toEqual({ done: 1, total: 3, percent: 33 })

      task.subtasks[1].done = true
      expect(progressOf(task)).toEqual({ done: 2, total: 3, percent: 67 })

      task.subtasks[2].done = true
      expect(progressOf(task)).toEqual({ done: 3, total: 3, percent: 100 })
    })
  })

  describe('syncStatusWithSubtasks', () => {
    it('jika subtugas kosong, status tidak pernah diubah', () => {
      const task = { status: STATUS.BELUM, subtasks: [] }
      expect(syncStatusWithSubtasks(task).status).toBe(STATUS.BELUM)
    })

    it('semua subtugas selesai -> status otomatis menjadi SELESAI', () => {
      const task = {
        status: STATUS.SEDANG,
        subtasks: [
          { id: '1', done: true },
          { id: '2', done: true },
        ],
      }
      expect(syncStatusWithSubtasks(task).status).toBe(STATUS.SELESAI)
    })

    it('ada yang selesai tapi belum semua, dan status BELUM -> status berubah menjadi SEDANG', () => {
      const task = {
        status: STATUS.BELUM,
        subtasks: [
          { id: '1', done: true },
          { id: '2', done: false },
        ],
      }
      expect(syncStatusWithSubtasks(task).status).toBe(STATUS.SEDANG)
    })

    it('tugas SELESAI jika salah satu subtugas di-uncheck -> status turun kembali ke SEDANG', () => {
      const task = {
        status: STATUS.SELESAI,
        subtasks: [
          { id: '1', done: true },
          { id: '2', done: false },
        ],
      }
      expect(syncStatusWithSubtasks(task).status).toBe(STATUS.SEDANG)
    })

    it('tugas SELESAI jika semua subtugas di-uncheck (done === 0) -> status turun ke SEDANG', () => {
      const task = {
        status: STATUS.SELESAI,
        subtasks: [
          { id: '1', done: false },
          { id: '2', done: false },
        ],
      }
      expect(syncStatusWithSubtasks(task).status).toBe(STATUS.SEDANG)
    })
  })

  describe('normalizeSubtasks', () => {
    it('membersihkan spasi, membuang item kosong, dan memotong judul di atas 80 karakter', () => {
      const longTitle = 'X'.repeat(100)
      const raw = [
        { title: '  Riset pustaka  ', done: true },
        { title: '   ' }, // kosong -> dibuang
        null, // invalid -> dibuang
        { title: longTitle, done: false },
      ]
      const result = normalizeSubtasks(raw)

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Riset pustaka')
      expect(result[0].done).toBe(true)
      expect(result[1].title.length).toBe(MAX_SUBTASK_TITLE_LENGTH)
      expect(result[1].done).toBe(false)
    })

    it('membatasi maksimal 20 subtugas', () => {
      const raw = Array.from({ length: 30 }, (_, i) => ({ title: `Subtask ${i + 1}` }))
      const result = normalizeSubtasks(raw)
      expect(result).toHaveLength(MAX_SUBTASKS)
      expect(result[19].title).toBe('Subtask 20')
    })
  })

  describe('migrateStoreV2ToV3', () => {
    it('mempertahankan pemfilteran matkul resmi (v2) dan menambahkan subtasks: [] untuk tugas lama', () => {
      const oldState = {
        tasks: [
          { courseCode: 'STSI4105', title: 'Tugas Basis Data' }, // valid
          { courseCode: 'IF9999', title: 'Tugas Tidak Resmi' }, // tidak dikenal -> dibuang
          {
            courseCode: 'STSI4209',
            title: 'Tugas Web',
            subtasks: [{ title: 'Bab 1', done: true }],
          },
        ],
      }

      const migrated = migrateStoreV2ToV3(oldState)

      expect(migrated.tasks).toHaveLength(2)
      expect(migrated.tasks[0].courseCode).toBe('STSI4105')
      expect(migrated.tasks[0].subtasks).toEqual([])

      expect(migrated.tasks[1].courseCode).toBe('STSI4209')
      expect(migrated.tasks[1].subtasks).toHaveLength(1)
      expect(migrated.tasks[1].subtasks[0].title).toBe('Bab 1')
    })
  })
})
