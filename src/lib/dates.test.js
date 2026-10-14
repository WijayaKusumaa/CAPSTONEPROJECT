import { describe, expect, it } from 'vitest'
import { addDays, describeCountdown, diffInDays, parseFlexibleDate, parseISODate, toISODate } from './dates'

describe('parseISODate', () => {
  it('berhasil mem-parsing string YYYY-MM-DD valid', () => {
    const date = parseISODate('2026-10-15')
    expect(date).toBeInstanceOf(Date)
    expect(date.getFullYear()).toBe(2026)
    expect(date.getMonth()).toBe(9) // 0-indexed: 9 = Oktober
    expect(date.getDate()).toBe(15)
  })

  it('mengembalikan null jika tanggal tidak valid (misal 31 Februari)', () => {
    expect(parseISODate('2026-02-31')).toBeNull()
    expect(parseISODate('invalid-date')).toBeNull()
    expect(parseISODate('')).toBeNull()
  })
})

describe('parseFlexibleDate', () => {
  it('menerima format YYYY-MM-DD dan YYYY/MM/DD', () => {
    expect(parseFlexibleDate('2026-10-05')).toBe('2026-10-05')
    expect(parseFlexibleDate('2026/10/05')).toBe('2026-10-05')
  })

  it('menerima format DD-MM-YYYY dan DD/MM/YYYY', () => {
    expect(parseFlexibleDate('05-10-2026')).toBe('2026-10-05')
    expect(parseFlexibleDate('5/10/2026')).toBe('2026-10-05')
  })

  it('mengembalikan null jika format tidak dikenali', () => {
    expect(parseFlexibleDate('random-string')).toBeNull()
    expect(parseFlexibleDate(null)).toBeNull()
  })
})

describe('diffInDays', () => {
  it('menghitung selisih hari kalender dengan benar', () => {
    expect(diffInDays('2026-10-10', '2026-10-15')).toBe(5)
    expect(diffInDays('2026-10-15', '2026-10-10')).toBe(-5)
    expect(diffInDays('2026-10-10', '2026-10-10')).toBe(0)
  })
})

describe('addDays', () => {
  it('menambah hari pada tanggal ISO', () => {
    expect(addDays('2026-10-10', 5)).toBe('2026-10-15')
    expect(addDays('2026-10-10', -3)).toBe('2026-10-07')
  })
})

describe('describeCountdown', () => {
  it('memberikan label teks hitung mundur yang sesuai', () => {
    expect(describeCountdown(-2)).toBe('Terlambat 2 hari')
    expect(describeCountdown(0)).toBe('Hari ini')
    expect(describeCountdown(1)).toBe('Besok')
    expect(describeCountdown(5)).toBe('5 hari lagi')
  })
})
