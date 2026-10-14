import { describe, expect, it } from 'vitest'
import { parseCsv, parseTasksCsv } from './csv'
import { collectDueReminders, getReminderStage } from './reminders'

describe('parseCsv', () => {
  it('menangani kutip, koma dalam sel, dan CRLF', () => {
    const rows = parseCsv('a,b\r\n"x, y","say ""hi"""\r\n')
    expect(rows).toEqual([
      ['a', 'b'],
      ['x, y', 'say "hi"'],
    ])
  })
  it('mendeteksi pemisah titik koma', () => {
    expect(parseCsv('a;b\n1;2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })
})

describe('parseTasksCsv', () => {
  const header = 'kode_mata_kuliah,nama_tugas,tanggal_mulai,tanggal_deadline,bobot'

  it('menerima baris valid & format tanggal DD/MM/YYYY', () => {
    const { valid, errors } = parseTasksCsv(`${header}\nif2101,Laporan,01/10/2026,2026-10-14,4`)
    expect(errors).toHaveLength(0)
    expect(valid[0]).toMatchObject({ courseCode: 'IF2101', startDate: '2026-10-01', deadline: '2026-10-14', weight: 4 })
  })

  it('melaporkan baris tidak valid dengan nomor baris spreadsheet', () => {
    const { valid, errors } = parseTasksCsv(`${header}\nIF1,Ok,2026-10-01,2026-10-02,3\nIF2,Salah,2026-10-05,2026-10-01,9`)
    expect(valid).toHaveLength(1)
    expect(errors[0].row).toBe(3)
    expect(errors[0].messages.length).toBeGreaterThanOrEqual(2)
  })

  it('gagal jika kolom wajib tidak ada', () => {
    expect(parseTasksCsv('foo,bar\n1,2').fatal).toMatch(/Kolom wajib/)
  })
})

describe('reminders', () => {
  it('memetakan sisa hari ke tahap H-3 / H-1 / H', () => {
    expect(getReminderStage(0).id).toBe('H')
    expect(getReminderStage(1).id).toBe('H-1')
    expect(getReminderStage(3).id).toBe('H-3')
    expect(getReminderStage(4)).toBeNull()
    expect(getReminderStage(-1)).toBeNull()
  })

  it('tidak mengulang pengingat & mengabaikan tugas selesai', () => {
    const base = { courseCode: 'IF1', title: 'T', deadline: '2026-10-10', status: 'belum' }
    const tasks = [{ ...base, id: 'a' }, { ...base, id: 'b', status: 'selesai' }]
    const first = collectDueReminders(tasks, '2026-10-09', {})
    expect(first).toHaveLength(1)
    const again = collectDueReminders(tasks, '2026-10-09', { [first[0].key]: true })
    expect(again).toHaveLength(0)
  })
})
