import { useMemo } from 'react'
import { rankTasks } from '../lib/priority'
import { useTaskStore } from '../store/taskStore'
import { useToday } from './useToday'

// Hook untuk mengambil daftar tugas yang sudah dihitung prioritasnya
export function useRankedTasks() {
  const tasks = useTaskStore((s) => s.tasks)
  const today = useToday()
  const ranked = useMemo(() => rankTasks(tasks, today), [tasks, today])
  return { ranked, today }
}
