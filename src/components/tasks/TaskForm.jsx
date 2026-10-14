import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { Plus, Trash2, X } from 'lucide-react'
import { COURSES, findCourse } from '../../data/courses'
import { WEIGHT_OPTIONS } from '../../lib/constants'
import { orderCourseGroups } from '../../lib/courseOptions'
import { toISODate } from '../../lib/dates'
import { createSubtaskId, MAX_SUBTASKS } from '../../lib/subtasks'
import { normalizeTaskInput, validateTask } from '../../lib/validation'
import { useSettingsStore } from '../../store/settingsStore'
import Button from '../ui/Button'
import Field from '../ui/Field'

const emptyForm = () => ({
  courseCode: '',
  title: '',
  startDate: toISODate(),
  deadline: '',
  weight: 3,
  subtasks: [],
})

const inputClass = (error) => clsx('input', error && 'input-error')

// Form input untuk tambah atau edit data tugas
export default function TaskForm({ initial, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => (initial ? { ...initial, subtasks: initial.subtasks ?? [] } : emptyForm()))
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [errors, setErrors] = useState({})
  const isEdit = Boolean(initial)

  const activeSemester = useSettingsStore((s) => s.activeSemester)
  const courseGroups = useMemo(() => orderCourseGroups(COURSES, activeSemester), [activeSemester])

  const setField = (name) => (event) => {
    const value = event.target.value
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleAddSubtask = (e) => {
    e?.preventDefault()
    const cleanTitle = newSubtaskTitle.trim()
    if (!cleanTitle) return
    if ((values.subtasks?.length ?? 0) >= MAX_SUBTASKS) return

    setValues((prev) => ({
      ...prev,
      subtasks: [...(prev.subtasks ?? []), { id: createSubtaskId(), title: cleanTitle, done: false }],
    }))
    setNewSubtaskTitle('')
  }

  const handleRemoveSubtask = (id) => {
    setValues((prev) => ({
      ...prev,
      subtasks: (prev.subtasks ?? []).filter((s) => s.id !== id),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const task = normalizeTaskInput(values)
    const found = validateTask(task)
    if (Object.keys(found).length) return setErrors(found)
    return onSubmit(task)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid gap-5">
        <Field label="Mata kuliah" htmlFor="courseCode" error={errors.courseCode}>
          <select
            id="courseCode"
            className={inputClass(errors.courseCode)}
            value={findCourse(values.courseCode)?.code ?? values.courseCode}
            onChange={setField('courseCode')}
            autoFocus
          >
            <option value="">Pilih mata kuliah…</option>
            {values.courseCode && !findCourse(values.courseCode) && (
              <option value={values.courseCode}>{values.courseCode}</option>
            )}
            {courseGroups.map((group) => (
              <optgroup key={group.key} label={group.label}>
                {group.courses.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <Field label="Nama tugas" htmlFor="title" error={errors.title}>
          <input
            id="title"
            className={inputClass(errors.title)}
            placeholder="Laporan praktikum bab 3"
            value={values.title}
            onChange={setField('title')}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tanggal mulai" htmlFor="startDate" error={errors.startDate}>
          <input
            id="startDate"
            type="date"
            className={inputClass(errors.startDate)}
            value={values.startDate}
            onChange={setField('startDate')}
          />
        </Field>
        <Field label="Tanggal deadline" htmlFor="deadline" error={errors.deadline}>
          <input
            id="deadline"
            type="date"
            className={inputClass(errors.deadline)}
            min={values.startDate || undefined}
            value={values.deadline}
            onChange={setField('deadline')}
          />
        </Field>
      </div>

      <fieldset>
        <legend className="label">Bobot / kesulitan</legend>
        <div className="grid grid-cols-5 gap-2">
          {WEIGHT_OPTIONS.map(({ value, label }) => {
            const active = Number(values.weight) === value
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setValues((prev) => ({ ...prev, weight: value }))}
                className={clsx(
                  'flex flex-col items-center gap-0.5 rounded-xl border px-1 py-2.5 transition',
                  active
                    ? 'border-brand-600 bg-brand-50 text-brand-800 ring-4 ring-brand-500/10'
                    : 'border-line bg-white text-ink-soft hover:border-stone-300',
                )}
              >
                <span className="text-base font-extrabold leading-none">{value}</span>
                <span className="text-[10px] font-semibold leading-tight">{label}</span>
              </button>
            )
          })}
        </div>
        {errors.weight && <p className="mt-1.5 text-xs font-medium text-rose-600">{errors.weight}</p>}
      </fieldset>

      {/* Bagian Checklist Subtugas */}
      <fieldset className="space-y-2">
        <div className="flex items-center justify-between">
          <legend className="label !mb-0">Tahapan / Subtugas (Opsional)</legend>
          <span className="text-[11px] font-medium text-ink-mute">
            {values.subtasks?.length ?? 0}/{MAX_SUBTASKS}
          </span>
        </div>

        {values.subtasks?.length > 0 && (
          <div className="space-y-1.5 rounded-xl border border-line bg-stone-50/50 p-2.5">
            {values.subtasks.map((st, index) => (
              <div
                key={st.id || index}
                className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-1.5 text-xs shadow-2xs ring-1 ring-line"
              >
                <span className="truncate font-medium text-ink">{st.title}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(st.id)}
                  title="Hapus"
                  className="rounded p-1 text-ink-mute transition hover:bg-rose-50 hover:text-rose-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {(values.subtasks?.length ?? 0) < MAX_SUBTASKS ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Contoh: Bab 1 Pendahuluan"
              maxLength={80}
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddSubtask()
                }
              }}
              className="input !py-1.5 text-xs flex-1"
            />
            <Button
              variant="secondary"
              type="button"
              onClick={handleAddSubtask}
              disabled={!newSubtaskTitle.trim()}
              className="!py-1.5 text-xs"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah
            </Button>
          </div>
        ) : (
          <p className="text-[11px] text-amber-700">Maksimal {MAX_SUBTASKS} subtugas tercapai.</p>
        )}
      </fieldset>

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="ghost" onClick={onCancel}>
          Batal
        </Button>
        <Button variant="primary" type="submit">
          {isEdit ? 'Simpan perubahan' : 'Tambah tugas'}
        </Button>
      </div>
    </form>
  )
}
