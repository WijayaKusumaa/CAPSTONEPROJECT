import { describe, expect, it } from 'vitest'
import { calculatePriority, difficultyScore, rankTasks, urgencyScore } from './priority'

const TODAY = '2026-10-09'
const task = (overrides) => ({
  id: 'x',
  title: 'T',
  courseCode: 'IF1',
  startDate: '2026-10-01',
  deadline: '2026-10-09',
  weight: 3,
  status: 'belum',
  ...overrides,
})

describe('urgencyScore', () => {
  it('maksimal saat hari H atau terlambat', () => {
    expect(urgencyScore(0)).toBe(100)
    expect(urgencyScore(-5)).toBe(100)
  })
  it('meluruh separuh setiap half-life (4 hari)', () => {
    expect(urgencyScore(4)).toBeCloseTo(50)
    expect(urgencyScore(8)).toBeCloseTo(25)
  })
})

describe('difficultyScore', () => {
  it('memetakan bobot 1–5 ke 20–100', () => {
    expect(difficultyScore(1)).toBe(20)
    expect(difficultyScore(5)).toBe(100)
  })
})

describe('calculatePriority', () => {
  it('tugas berat & deadline hari ini = skor 100 (kritis)', () => {
    const p = calculatePriority(task({ weight: 5 }), TODAY)
    expect(p.score).toBe(100)
    expect(p.level).toBe('critical')
  })
  it('tugas selesai selalu skor 0', () => {
    const p = calculatePriority(task({ status: 'selesai' }), TODAY)
    expect(p.score).toBe(0)
    expect(p.level).toBe('done')
  })
  it('status "sedang" lebih rendah dari "belum"', () => {
    const belum = calculatePriority(task(), TODAY).score
    const sedang = calculatePriority(task({ status: 'sedang' }), TODAY).score
    expect(sedang).toBeLessThan(belum)
  })
  it('menandai tugas terlambat', () => {
    expect(calculatePriority(task({ deadline: '2026-10-07' }), TODAY).overdue).toBe(true)
  })
})

describe('rankTasks', () => {
  it('mengurutkan dari skor tertinggi dan menaruh tugas selesai di bawah', () => {
    const list = [
      task({ id: 'far', deadline: '2026-11-20', weight: 2 }),
      task({ id: 'done', status: 'selesai' }),
      task({ id: 'soon', deadline: '2026-10-10', weight: 4 }),
    ]
    expect(rankTasks(list, TODAY).map((t) => t.id)).toEqual(['soon', 'far', 'done'])
  })
})
