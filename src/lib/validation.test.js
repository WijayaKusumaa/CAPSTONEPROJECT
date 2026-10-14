import { describe, expect, it } from 'vitest'
import { normalizeTaskInput, validateTask } from './validation'
import { STATUS } from './constants'

describe('normalizeTaskInput', () => {
  it('membersihkan whitespace dan mengubah kode mata kuliah menjadi huruf kapital', () => {
    const input = {
      courseCode: '  if2101  ',
      title: '  Tugas Praktikum  ',
      startDate: '2026-10-01',
      deadline: '2026-10-10',
      weight: '4',
      status: 'sedang',
    }
    const result = normalizeTaskInput(input)
    expect(result.courseCode).toBe('IF2101')
    expect(result.title).toBe('Tugas Praktikum')
    expect(result.weight).toBe(4)
    expect(result.status).toBe(STATUS.SEDANG)
  })

  it('menggunakan status default "belum" jika status tidak valid atau kosong', () => {
    const result = normalizeTaskInput({ status: 'invalid_status' })
    expect(result.status).toBe(STATUS.BELUM)
  })
})

describe('validateTask', () => {
  const validTask = {
    courseCode: 'IF2101',
    title: 'Laporan Basis Data',
    startDate: '2026-10-01',
    deadline: '2026-10-10',
    weight: 4,
    status: STATUS.BELUM,
  }

  it('mengembalikan object kosong jika seluruh data valid', () => {
    const errors = validateTask(validTask)
    expect(Object.keys(errors)).toHaveLength(0)
  })

  it('memvalidasi field wajib (kode mata kuliah dan nama tugas)', () => {
    const errors = validateTask({ ...validTask, courseCode: '', title: '' })
    expect(errors.courseCode).toBeDefined()
    expect(errors.title).toBeDefined()
  })

  it('menolak format tanggal yang tidak valid', () => {
    const errors = validateTask({ ...validTask, startDate: 'bukan-tanggal', deadline: '2026-02-30' })
    expect(errors.startDate).toBeDefined()
    expect(errors.deadline).toBeDefined()
  })

  it('menolak jika deadline lebih awal dari tanggal mulai', () => {
    const errors = validateTask({ ...validTask, startDate: '2026-10-15', deadline: '2026-10-10' })
    expect(errors.deadline).toBe('Deadline tidak boleh sebelum tanggal mulai.')
  })

  it('memvalidasi rentang bobot harus bilangan bulat 1 sampai 5', () => {
    expect(validateTask({ ...validTask, weight: 0 }).weight).toBeDefined()
    expect(validateTask({ ...validTask, weight: 6 }).weight).toBeDefined()
    expect(validateTask({ ...validTask, weight: 3.5 }).weight).toBeDefined()
  })
})
