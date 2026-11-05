import { describe, expect, it } from 'vitest'
import { calculatePriority, difficultyScore, rankTasks, urgencyScore, WEIGHT_SCENARIOS } from './priority'

const TODAY = '2026-10-09'
const task = (overrides) => ({
  id: 'x',
  title: 'T',
  courseCode: 'STSI4440',
  startDate: '2026-10-01',
  deadline: '2026-10-09',
  weight: 3,
  status: 'belum',
  ...overrides,
})

describe('urgencyScore (Tabel 2.2 Tugas 2)', () => {
  it('mengembalikan 100 saat deadline terlewat (< 0 hari) atau 0–1 hari', () => {
    expect(urgencyScore(-5)).toBe(100)
    expect(urgencyScore(0)).toBe(100)
    expect(urgencyScore(1)).toBe(100)
  })

  it('mengembalikan 80 untuk sisa waktu 2–3 hari', () => {
    expect(urgencyScore(2)).toBe(80)
    expect(urgencyScore(3)).toBe(80)
  })

  it('mengembalikan 60 untuk sisa waktu 4–7 hari', () => {
    expect(urgencyScore(4)).toBe(60)
    expect(urgencyScore(7)).toBe(60)
  })

  it('mengembalikan 40 untuk sisa waktu 8–14 hari', () => {
    expect(urgencyScore(8)).toBe(40)
    expect(urgencyScore(14)).toBe(40)
  })

  it('mengembalikan 20 untuk sisa waktu lebih dari 14 hari', () => {
    expect(urgencyScore(15)).toBe(20)
    expect(urgencyScore(30)).toBe(20)
  })
})

describe('difficultyScore (Rumus 2.2 Tugas 2)', () => {
  it('memetakan tingkat kesulitan 1–5 ke 20, 40, 60, 80, 100', () => {
    expect(difficultyScore(1)).toBe(20)
    expect(difficultyScore(2)).toBe(40)
    expect(difficultyScore(3)).toBe(60)
    expect(difficultyScore(4)).toBe(80)
    expect(difficultyScore(5)).toBe(100)
  })
})

describe('calculatePriority (Rumus 2.1 & Tabel 2.3 Tugas 2)', () => {
  it('tugas kesulitan 5 & deadline hari ini = skor 100 (kritis)', () => {
    const p = calculatePriority(task({ weight: 5 }), TODAY)
    expect(p.score).toBe(100)
    expect(p.level).toBe('critical')
    expect(p.formula).toBe('(0,6 × 100) + (0,4 × 100) = 100')
  })

  it('tugas selesai memiliki level "done" namun tetap menyimpan skor SAW murni (20–100)', () => {
    const p = calculatePriority(task({ status: 'selesai', weight: 4, deadline: '2026-10-11' }), TODAY)
    expect(p.score).toBe(80)
    expect(p.level).toBe('done')
    expect(p.overdue).toBe(false)
  })

  it('menandai tugas terlambat (overdue) jika melewati deadline dan belum selesai', () => {
    expect(calculatePriority(task({ deadline: '2026-10-07' }), TODAY).overdue).toBe(true)
    expect(calculatePriority(task({ deadline: '2026-10-07', status: 'selesai' }), TODAY).overdue).toBe(false)
  })

  it('mendukung perhitungan tiga skenario bobot validasi (0,6:0,4, 0,75:0,25, 0,5:0,5)', () => {
    // Sisa 6 hari (U = 60), Kesulitan 5 (K = 100)
    const sample = task({ deadline: '2026-10-15', weight: 5 })
    expect(calculatePriority(sample, TODAY, WEIGHT_SCENARIOS.DEFAULT).score).toBe(76) // (0.6*60)+(0.4*100)
    expect(calculatePriority(sample, TODAY, WEIGHT_SCENARIOS.ROC).score).toBe(70) // (0.75*60)+(0.25*100)
    expect(calculatePriority(sample, TODAY, WEIGHT_SCENARIOS.EQUAL).score).toBe(80) // (0.5*60)+(0.5*100)
  })
})

describe('rankTasks (Contoh Perhitungan Tabel 2.3 Tugas 2)', () => {
  it('menghasilkan skor dan urutan persis sesuai Tabel 2.3 (T1=80, T2=76, T3=76, T4=64) beserta aturan seri deadline', () => {
    const list = [
      task({ id: 'T4', deadline: '2026-10-21', weight: 5 }), // 12 hari, D=5 -> U=40, K=100 -> P=64
      task({ id: 'T3', deadline: '2026-10-15', weight: 5 }), // 6 hari, D=5 -> U=60, K=100 -> P=76
      task({ id: 'T2', deadline: '2026-10-10', weight: 2 }), // 1 hari, D=2 -> U=100, K=40 -> P=76
      task({ id: 'T1', deadline: '2026-10-11', weight: 4 }), // 2 hari, D=4 -> U=80, K=80 -> P=80
    ]

    const ranked = rankTasks(list, TODAY)
    expect(ranked.map((t) => ({ id: t.id, score: t.priority.score }))).toEqual([
      { id: 'T1', score: 80 },
      { id: 'T2', score: 76 },
      { id: 'T3', score: 76 },
      { id: 'T4', score: 64 },
    ])
  })

  it('mengurutkan dari skor tertinggi dan menaruh tugas selesai di urutan paling bawah', () => {
    const list = [
      task({ id: 'far', deadline: '2026-11-20', weight: 2 }),
      task({ id: 'done', status: 'selesai', deadline: '2026-10-09', weight: 5 }),
      task({ id: 'soon', deadline: '2026-10-10', weight: 4 }),
    ]
    expect(rankTasks(list, TODAY).map((t) => t.id)).toEqual(['soon', 'far', 'done'])
  })
})
