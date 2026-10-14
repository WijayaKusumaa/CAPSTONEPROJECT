/**
 * Perhitungan skor prioritas tugas mahasiswa
 * 
 * Formula:
 *   skor = (bobot_urgensi * nilai_urgensi + bobot_kesulitan * nilai_kesulitan) * pengali_status
 *
 * - Urgensi (0-100): kedekatan deadline tugas (semakin dekat, semakin tinggi).
 * - Kesulitan (20-100): konversi nilai bobot tugas skala 1 sampai 5.
 * - Bobot formula: urgensi 65%, kesulitan 35%.
 * - Pengali status: Belum = 1.0, Sedang = 0.85, Selesai = 0.
 */
import { PRIORITY_LEVEL, STATUS, MAX_WEIGHT, MIN_WEIGHT } from './constants'
import { describeCountdown, diffInDays } from './dates'

export const PRIORITY_CONFIG = Object.freeze({
  urgencyWeight: 0.65,
  difficultyWeight: 0.35,
  halfLifeDays: 4,
  statusMultiplier: {
    [STATUS.BELUM]: 1,
    [STATUS.SEDANG]: 0.85,
    [STATUS.SELESAI]: 0,
  },
  // Batas skor untuk menentukan level prioritas
  thresholds: { critical: 75, high: 55, medium: 35 },
})

const round1 = (n) => Math.round(n * 10) / 10
const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

// Hitung nilai urgensi dari sisa hari (semakin mepet, skor mendekati 100)
export function urgencyScore(daysLeft, { halfLifeDays } = PRIORITY_CONFIG) {
  if (!Number.isFinite(daysLeft) || daysLeft <= 0) return 100
  return 100 * Math.pow(0.5, daysLeft / halfLifeDays)
}

// Konversi bobot 1-5 menjadi rentang 20-100
export function difficultyScore(weight) {
  const safe = clamp(Number(weight) || MIN_WEIGHT, MIN_WEIGHT, MAX_WEIGHT)
  return (safe / MAX_WEIGHT) * 100
}

export function levelFromScore(score, status) {
  const { thresholds } = PRIORITY_CONFIG
  if (status === STATUS.SELESAI) return PRIORITY_LEVEL.DONE
  if (score >= thresholds.critical) return PRIORITY_LEVEL.CRITICAL
  if (score >= thresholds.high) return PRIORITY_LEVEL.HIGH
  if (score >= thresholds.medium) return PRIORITY_LEVEL.MEDIUM
  return PRIORITY_LEVEL.LOW
}

// Menghitung data prioritas untuk satu item tugas
export function calculatePriority(task, today) {
  const { urgencyWeight, difficultyWeight, statusMultiplier } = PRIORITY_CONFIG

  const daysLeft = diffInDays(today, task.deadline)
  const urgency = urgencyScore(daysLeft)
  const difficulty = difficultyScore(task.weight)
  const multiplier = statusMultiplier[task.status] ?? 1

  const score = round1((urgency * urgencyWeight + difficulty * difficultyWeight) * multiplier)

  return {
    score,
    level: levelFromScore(score, task.status),
    daysLeft,
    urgency: round1(urgency),
    difficulty: round1(difficulty),
    overdue: daysLeft < 0 && task.status !== STATUS.SELESAI,
    reason: `${describeCountdown(daysLeft)} · bobot ${task.weight}/${MAX_WEIGHT}`,
  }
}

// Urutkan tugas: skor prioritas tertinggi di atas, lalu deadline terdekat
function byPriorityDesc(a, b) {
  return (
    b.priority.score - a.priority.score ||
    a.priority.daysLeft - b.priority.daysLeft ||
    b.weight - a.weight ||
    a.title.localeCompare(b.title, 'id')
  )
}

// Pasang nilai prioritas dan urutkan daftar tugas
export function rankTasks(tasks, today) {
  return tasks
    .map((task) => ({ ...task, priority: calculatePriority(task, today) }))
    .sort(byPriorityDesc)
}
