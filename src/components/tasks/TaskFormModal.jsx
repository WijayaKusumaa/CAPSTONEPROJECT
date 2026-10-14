import { useTaskStore } from '../../store/taskStore'
import { toast } from '../../store/toastStore'
import { useUiStore } from '../../store/uiStore'
import Modal from '../ui/Modal'
import TaskForm from './TaskForm'

// Modal dialog untuk form tambah dan edit tugas
export default function TaskFormModal() {
  const taskForm = useUiStore((s) => s.taskForm)
  const closeTaskForm = useUiStore((s) => s.closeTaskForm)
  const addTask = useTaskStore((s) => s.addTask)
  const updateTask = useTaskStore((s) => s.updateTask)

  const editing = taskForm?.task ?? null

  const handleSubmit = (values) => {
    if (editing) {
      updateTask(editing.id, values)
      toast.success('Tugas diperbarui', values.title)
    } else {
      addTask(values)
      toast.success('Tugas ditambahkan', values.title)
    }
    closeTaskForm()
  }

  return (
    <Modal
      open={Boolean(taskForm)}
      onClose={closeTaskForm}
      title={editing ? 'Edit tugas' : 'Tambah tugas baru'}
      description="Skor prioritas dihitung otomatis dari deadline dan bobot."
    >
      <TaskForm key={editing?.id ?? 'new'} initial={editing} onSubmit={handleSubmit} onCancel={closeTaskForm} />
    </Modal>
  )
}
