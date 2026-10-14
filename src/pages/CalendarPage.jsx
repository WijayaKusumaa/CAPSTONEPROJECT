import { CalendarX2, Plus } from 'lucide-react'
import TaskCalendar from '../components/calendar/TaskCalendar'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'
import { useRankedTasks } from '../hooks/useRankedTasks'
import { useUiStore } from '../store/uiStore'

export default function CalendarPage() {
  const { ranked } = useRankedTasks()
  const openTaskForm = useUiStore((s) => s.openTaskForm)

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Kalender</h1>
        <p className="mt-1 text-sm text-ink-soft">Rentang pengerjaan tiap tugas, dari tanggal mulai hingga deadline.</p>
      </div>

      {ranked.length === 0 ? (
        <EmptyState
          icon={CalendarX2}
          title="Kalender masih kosong"
          description="Tugas yang kamu tambahkan akan muncul di sini sebagai rentang waktu."
        >
          <Button variant="primary" onClick={() => openTaskForm()}>
            <Plus className="h-4 w-4" /> Tambah tugas
          </Button>
        </EmptyState>
      ) : (
        <div className="card p-4 sm:p-6">
          <TaskCalendar tasks={ranked} />
        </div>
      )}
    </>
  )
}
