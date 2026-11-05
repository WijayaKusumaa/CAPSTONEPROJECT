import { STATUS } from './constants'
import { diffInDays } from './dates'

// Konfigurasi tahapan notifikasi deadline (Hari H, H-1, H-3)
export const REMINDER_STAGES = {
  H: { id: 'H', variant: 'danger', title: 'Deadline hari ini!' },
  'H-1': { id: 'H-1', variant: 'warning', title: 'Deadline besok' },
  'H-3': { id: 'H-3', variant: 'info', title: 'Deadline segera tiba' },
}

export function getReminderStage(daysLeft) {
  if (!Number.isFinite(daysLeft) || daysLeft < 0) return null
  if (daysLeft === 0) return REMINDER_STAGES.H
  if (daysLeft === 1) return REMINDER_STAGES['H-1']
  if (daysLeft <= 3) return REMINDER_STAGES['H-3']
  return null
}

// ID unik pengingat agar notifikasi tidak muncul berulang kali
export const reminderKey = (task, stage) => `${task.id}|${task.deadline}|${stage.id}`

// Cari tugas yang mendekati deadline dan belum pernah dinotifikasi
export function collectDueReminders(tasks, today, alreadyNotified) {
  return tasks.flatMap((task) => {
    if (task.status === STATUS.SELESAI) return []
    const daysLeft = diffInDays(today, task.deadline)
    const stage = getReminderStage(daysLeft)
    if (!stage || alreadyNotified[reminderKey(task, stage)]) return []

    const when = daysLeft === 0 ? 'hari ini' : daysLeft === 1 ? 'besok' : `${daysLeft} hari lagi`
    return [
      {
        key: reminderKey(task, stage),
        taskId: task.id,
        stage,
        title: stage.title,
        message: `${task.courseCode} · ${task.title} — deadline ${when}.`,
      },
    ]
  })
}

const STAGE_PRIORITY = { H: 0, 'H-1': 1, 'H-3': 2 }

// Kumpulkan seluruh pengingat deadline aktif (H-3, H-1, Hari H) untuk ditampilkan di panel notifikasi dalam aplikasi
export function collectActiveReminders(tasks, today, notified = {}) {
  return tasks
    .flatMap((task) => {
      if (task.status === STATUS.SELESAI) return []
      const daysLeft = diffInDays(today, task.deadline)
      const stage = getReminderStage(daysLeft)
      if (!stage) return []

      const key = reminderKey(task, stage)
      const rawNotifiedAt = notified[key]
      const notifiedAt = typeof rawNotifiedAt === 'string' ? rawNotifiedAt : null
      const when = daysLeft === 0 ? 'Hari ini' : daysLeft === 1 ? 'Besok' : `${daysLeft} hari lagi`

      return [
        {
          key,
          task,
          stage,
          daysLeft,
          when,
          notifiedAt,
          title: stage.title,
          message: `${task.courseCode} · ${task.title}`,
        },
      ]
    })
    .sort((a, b) => (STAGE_PRIORITY[a.stage.id] ?? 9) - (STAGE_PRIORITY[b.stage.id] ?? 9) || a.daysLeft - b.daysLeft)
}
