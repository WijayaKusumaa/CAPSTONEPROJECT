import { describe, expect, it } from 'vitest'
import { parseTasksCsv } from './csv'
import { buildExportFilename, parseBackupJson, tasksToBackupJson, tasksToCsv } from './export'

const sampleTasks = [
  {
    courseCode: 'STSI4105',
    title: 'Laporan Praktikum "Basis Data", Bab 1-3',
    startDate: '2026-10-01',
    deadline: '2026-10-15',
    weight: 4,
    status: 'sedang',
  },
  {
    courseCode: 'STSI4209',
    title: 'Proyek Web\nTahap 1',
    startDate: '2026-10-05',
    deadline: '2026-10-20',
    weight: 5,
    status: 'belum',
  },
]

describe('export.js', () => {
  describe('tasksToCsv', () => {
    it('menghasilkan CSV ber-BOM UTF-8 dengan header lengkap', () => {
      const csv = tasksToCsv(sampleTasks)
      expect(csv.startsWith('\uFEFF')).toBe(true)
      expect(csv).toContain('kode_mata_kuliah,nama_tugas,tanggal_mulai,tanggal_deadline,bobot,status')
      expect(csv.endsWith('\n')).toBe(true)
    })

    it('meng-escape tanda kutip, koma, dan newline dengan benar', () => {
      const csv = tasksToCsv(sampleTasks)
      expect(csv).toContain('"Laporan Praktikum ""Basis Data"", Bab 1-3"')
      expect(csv).toContain('"Proyek Web\nTahap 1"')
    })

    it('round-trip: CSV hasil ekspor dapat di-parse kembali oleh parseTasksCsv tanpa kehilangan data', () => {
      const csv = tasksToCsv(sampleTasks)
      const parsed = parseTasksCsv(csv)

      expect(parsed.fatal).toBeNull()
      expect(parsed.errors).toHaveLength(0)
      expect(parsed.valid).toHaveLength(2)

      expect(parsed.valid[0]).toMatchObject({
        courseCode: 'STSI4105',
        title: 'Laporan Praktikum "Basis Data", Bab 1-3',
        startDate: '2026-10-01',
        deadline: '2026-10-15',
        weight: 4,
        status: 'sedang',
      })

      expect(parsed.valid[1]).toMatchObject({
        courseCode: 'STSI4209',
        title: 'Proyek Web\nTahap 1',
        startDate: '2026-10-05',
        deadline: '2026-10-20',
        weight: 5,
        status: 'belum',
      })
    })

    it('menangani daftar kosong hanya dengan header', () => {
      const csv = tasksToCsv([])
      expect(csv).toBe('\uFEFFkode_mata_kuliah,nama_tugas,tanggal_mulai,tanggal_deadline,bobot,status\n')
    })
  })

  describe('tasksToBackupJson & parseBackupJson', () => {
    it('round-trip backup JSON berhasil dengan struktur resmi', () => {
      const jsonStr = tasksToBackupJson(sampleTasks)
      const res = parseBackupJson(jsonStr)

      expect(res.fatal).toBeNull()
      expect(res.errors).toHaveLength(0)
      expect(res.tasks).toHaveLength(2)
      expect(res.tasks[0]).toMatchObject(sampleTasks[0])
      expect(res.tasks[1]).toMatchObject(sampleTasks[1])
    })

    it('menolak string JSON yang rusak', () => {
      const res = parseBackupJson('{ invalid json ')
      expect(res.fatal).toBeTruthy()
      expect(res.tasks).toHaveLength(0)
    })

    it('menolak berkas yang bukan berasal dari TugasKu', () => {
      const wrongApp = JSON.stringify({ app: 'other-app', tasks: [] })
      const res = parseBackupJson(wrongApp)
      expect(res.fatal).toContain('bukan berkas backup resmi TugasKu')
    })

    it('mencatat error jika ada item tugas yang tidak valid', () => {
      const invalidData = JSON.stringify({
        app: 'tugasku',
        tasks: [
          { courseCode: '', title: '' }, // invalid
          sampleTasks[0], // valid
        ],
      })
      const res = parseBackupJson(invalidData)
      expect(res.errors).toHaveLength(1)
      expect(res.tasks).toHaveLength(1)
      expect(res.tasks[0].courseCode).toBe('STSI4105')
    })
  })

  describe('buildExportFilename', () => {
    it('membuat nama berkas yang rapi dengan tanggal', () => {
      expect(buildExportFilename('tugasku', 'csv', '2026-10-14')).toBe('tugasku-2026-10-14.csv')
      expect(buildExportFilename('backup-tugasku', '.json', '2026-10-14')).toBe('backup-tugasku-2026-10-14.json')
    })
  })
})
