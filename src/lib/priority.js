/**
 * Perhitungan skor prioritas tugas mahasiswa (Metode Simple Additive Weighting / SAW)
 * Sesuai Bab 2.5 & 2.6 Laporan Kemajuan Capstone Project STSI4440:
 *
 * Formula (2.1):
 *   P = (0,6 * U) + (0,4 * K)
 *
 * Formula (2.2):
 *   K = (D / 5) * 100
 *
 * Tabel 2.2 Skor Urgensi (U):
 *   - Lebih dari 14 hari : 20
 *   - 8–14 hari          : 40
 *   - 4–7 hari           : 60
 *   - 2–3 hari           : 80
 *   - 0–1 hari           : 100
 *   - Deadline terlewat  : 100 (ditandai terlambat / overdue)
 */
import { PRIORITY_LEVEL, STATUS, MAX_WEIGHT, MIN_WEIGHT } from './constants'
import { describeCountdown, diffInDays } from './dates'

// Tiga skenario bobot untuk validasi sesuai Subbab 2.5, 2.6.4, dan 3.1.5
export const WEIGHT_SCENARIOS = Object.freeze({
  DEFAULT: { id: '0.6:0.4', label: 'Bobot Utama (0,6 : 0,4)', urgencyWeight: 0.6, difficultyWeight: 0.4 },
  ROC: { id: '0.75:0.25', label: 'Acuan ROC (0,75 : 0,25)', urgencyWeight: 0.75, difficultyWeight: 0.25 },
  EQUAL: { id: '0.5:0.5', label: 'Seimbang (0,5 : 0,5)', urgencyWeight: 0.5, difficultyWeight: 0.5 },
})

export const PRIORITY_CONFIG = Object.freeze({
  urgencyWeight: WEIGHT_SCENARIOS.DEFAULT.urgencyWeight,
  difficultyWeight: WEIGHT_SCENARIOS.DEFAULT.difficultyWeight,
  // Batas skor untuk menentukan kategori visual level prioritas
  thresholds: { critical: 75, high: 60, medium: 40 },
})

const round1 = (n) => Math.round(n * 10) / 10
const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

// Hitung skor urgensi (U) bertahap sesuai Tabel 2.2
export function urgencyScore(daysLeft) {
  if (!Number.isFinite(daysLeft) || daysLeft <= 1) return 100
  if (daysLeft <= 3) return 80
  if (daysLeft <= 7) return 60
  if (daysLeft <= 14) return 40
  return 20
}

// Konversi tingkat kesulitan D (1-5) menjadi skor kesulitan K (20-100) sesuai Rumus (2.2)
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
export function calculatePriority(task, today, weights = PRIORITY_CONFIG) {
  const urgencyWeight = weights?.urgencyWeight ?? PRIORITY_CONFIG.urgencyWeight
  const difficultyWeight = weights?.difficultyWeight ?? PRIORITY_CONFIG.difficultyWeight

  const daysLeft = diffInDays(today, task.deadline)
  const urgency = urgencyScore(daysLeft)
  const difficulty = difficultyScore(task.weight)

  const score = round1(urgency * urgencyWeight + difficulty * difficultyWeight)
  const overdue = daysLeft < 0 && task.status !== STATUS.SELESAI
  const uWeightLabel = String(urgencyWeight).replace('.', ',')
  const kWeightLabel = String(difficultyWeight).replace('.', ',')

  return {
    score,
    level: levelFromScore(score, task.status),
    daysLeft,
    urgency: round1(urgency),
    difficulty: round1(difficulty),
    overdue,
    formula: `(${uWeightLabel} × ${urgency}) + (${kWeightLabel} × ${difficulty}) = ${score}`,
    reason: `${describeCountdown(daysLeft)} · kesulitan ${task.weight}/${MAX_WEIGHT}`,
  }
}

// Urutkan tugas sesuai aturan bisnis Subbab 3.2.4:
// 1. Tugas aktif (belum/sedang) di atas tugas selesai
// 2. Skor prioritas tertinggi ke terendah
// 3. Jika skor sama (seri), deadline yang lebih dekat ditempatkan lebih dahulu
// 4. Jika deadline juga sama, tingkat kesulitan lebih tinggi lalu urutan abjad judul
function byPriorityDesc(a, b) {
  const aDone = a.status === STATUS.SELESAI ? 1 : 0
  const bDone = b.status === STATUS.SELESAI ? 1 : 0
  if (aDone !== bDone) return aDone - bDone

  return (
    b.priority.score - a.priority.score ||
    a.priority.daysLeft - b.priority.daysLeft ||
    b.weight - a.weight ||
    a.title.localeCompare(b.title, 'id')
  )
}

// Pasang nilai prioritas dan urutkan daftar tugas
export function rankTasks(tasks, today, weights = PRIORITY_CONFIG) {
  return tasks
    .map((task) => ({ ...task, priority: calculatePriority(task, today, weights) }))
    .sort(byPriorityDesc)
}
