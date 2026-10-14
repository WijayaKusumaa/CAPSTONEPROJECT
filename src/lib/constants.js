// Konstanta untuk opsi status, bobot, dan level prioritas

export const STATUS = Object.freeze({
  BELUM: 'belum',
  SEDANG: 'sedang',
  SELESAI: 'selesai',
})

export const STATUS_OPTIONS = [
  { value: STATUS.BELUM, label: 'Belum' },
  { value: STATUS.SEDANG, label: 'Sedang' },
  { value: STATUS.SELESAI, label: 'Selesai' },
]

export const WEIGHT_OPTIONS = [
  { value: 1, label: 'Ringan' },
  { value: 2, label: 'Cukup' },
  { value: 3, label: 'Sedang' },
  { value: 4, label: 'Berat' },
  { value: 5, label: 'Sangat berat' },
]

export const MIN_WEIGHT = 1
export const MAX_WEIGHT = 5

export const PRIORITY_LEVEL = Object.freeze({
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
  DONE: 'done',
})

// Data label untuk masing-masing level prioritas
export const PRIORITY_META = {
  [PRIORITY_LEVEL.CRITICAL]: { label: 'Kritis' },
  [PRIORITY_LEVEL.HIGH]: { label: 'Tinggi' },
  [PRIORITY_LEVEL.MEDIUM]: { label: 'Sedang' },
  [PRIORITY_LEVEL.LOW]: { label: 'Rendah' },
  [PRIORITY_LEVEL.DONE]: { label: 'Selesai' },
}
