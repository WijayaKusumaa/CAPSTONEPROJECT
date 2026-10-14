import AppShell from './components/layout/AppShell'
import ToastViewport from './components/notifications/ToastViewport'
import CsvImportModal from './components/tasks/CsvImportModal'
import TaskFormModal from './components/tasks/TaskFormModal'
import ConfirmDialog from './components/ui/ConfirmDialog'
import { PAGES, useHashPage } from './hooks/useHashPage'
import { useReminders } from './hooks/useReminders'
import CalendarPage from './pages/CalendarPage'
import DashboardPage from './pages/DashboardPage'
import PrintPage from './pages/PrintPage'
import { useTaskStore } from './store/taskStore'
import { toast } from './store/toastStore'
import { useUiStore } from './store/uiStore'

function DeleteTaskDialog() {
  const target = useUiStore((s) => s.deleteTarget)
  const cancelDelete = useUiStore((s) => s.cancelDelete)
  const removeTask = useTaskStore((s) => s.removeTask)

  const confirm = () => {
    removeTask(target.id)
    toast.success('Tugas dihapus', target.title)
    cancelDelete()
  }

  return (
    <ConfirmDialog
      open={Boolean(target)}
      title="Hapus tugas ini?"
      description={target ? `"${target.title}" akan dihapus permanen.` : ''}
      onConfirm={confirm}
      onCancel={cancelDelete}
    />
  )
}

export default function App() {
  const [page, navigate] = useHashPage()
  useReminders()

  return (
    <AppShell page={page} onNavigate={navigate}>
      {page === PAGES.CALENDAR ? (
        <CalendarPage />
      ) : page === PAGES.PRINT ? (
        <PrintPage onBack={() => navigate(PAGES.DASHBOARD)} />
      ) : (
        <DashboardPage />
      )}

      <TaskFormModal />
      <CsvImportModal />
      <DeleteTaskDialog />
      <ToastViewport />
    </AppShell>
  )
}
