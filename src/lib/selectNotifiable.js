import { REMINDER_STAGES } from './reminders'

export const MAX_NATIVE_NOTIFICATIONS = 3

const STAGE_ORDER = { [REMINDER_STAGES.H.id]: 0, [REMINDER_STAGES['H-1'].id]: 1, [REMINDER_STAGES['H-3'].id]: 2 }

// Pilih pengingat yang dikirim sebagai notifikasi native.
// Aturan: fitur aktif + izin granted + tab sedang tidak dilihat (hidden).
// Saat tab terlihat cukup toast. Maksimum 3 notifikasi; sisanya digabung jadi satu ringkasan.
export function selectNotifiable(due, { enabled, permission, visibility }, max = MAX_NATIVE_NOTIFICATIONS) {
  if (!enabled || permission !== 'granted' || visibility !== 'hidden' || !due.length) return []

  const sorted = [...due].sort((a, b) => (STAGE_ORDER[a.stage.id] ?? 9) - (STAGE_ORDER[b.stage.id] ?? 9))
  const toNotification = (reminder) => ({ title: reminder.title, body: reminder.message, tag: reminder.key })

  if (sorted.length <= max) return sorted.map(toNotification)

  const individual = sorted.slice(0, max - 1)
  const rest = sorted.slice(max - 1)
  return [
    ...individual.map(toNotification),
    {
      title: 'Pengingat deadline',
      body: `dan ${rest.length} tugas lainnya mendekati deadline.`,
      tag: `summary|${rest.map((r) => r.key).join(',')}`,
    },
  ]
}
