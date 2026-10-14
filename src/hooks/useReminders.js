import { useEffect } from 'react'
import { getPermission, showTaskNotification } from '../lib/browserNotify'
import { collectDueReminders } from '../lib/reminders'
import { selectNotifiable } from '../lib/selectNotifiable'
import { useSettingsStore } from '../store/settingsStore'
import { useTaskStore } from '../store/taskStore'
import { toast } from '../store/toastStore'
import { useToday } from './useToday'

// Hook untuk memeriksa dan menampilkan toast pengingat deadline.
// Jika notifikasi browser aktif dan tab sedang tidak dilihat, pengingat juga dikirim sebagai notifikasi native.
export function useReminders() {
  const tasks = useTaskStore((s) => s.tasks)
  const today = useToday()

  useEffect(() => {
    const { notified, markNotified } = useTaskStore.getState()
    const due = collectDueReminders(tasks, today, notified)
    if (!due.length) return

    markNotified(due.map((reminder) => reminder.key))
    due.forEach(({ stage, title, message }) =>
      toast.show({ title, message, variant: stage.variant, duration: 10000 }),
    )

    selectNotifiable(due, {
      enabled: useSettingsStore.getState().browserNotifications,
      permission: getPermission(),
      visibility: document.visibilityState,
    }).forEach(showTaskNotification)
  }, [tasks, today])
}
