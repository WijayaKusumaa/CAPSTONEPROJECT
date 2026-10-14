import { useState } from 'react'
import clsx from 'clsx'
import { CalendarDays, CheckSquare, ChevronDown, ChevronUp, Pencil, Plus, Trash2, Weight, X } from 'lucide-react'
import { findCourse } from '../../data/courses'
import { MAX_WEIGHT, STATUS, WEIGHT_OPTIONS } from '../../lib/constants'
import { describeCountdown, formatRange } from '../../lib/dates'
import { MAX_SUBTASKS, progressOf } from '../../lib/subtasks'
import { useTaskStore } from '../../store/taskStore'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Highlight from './Highlight'
import PriorityBadge from './PriorityBadge'
import { PRIORITY_STYLES } from './priorityStyles'
import StatusToggle from './StatusToggle'

function WeightMeter({ weight }) {
  const label = WEIGHT_OPTIONS.find((o) => o.value === weight)?.label
  return (
    <span className="inline-flex items-center gap-1.5" title={`Bobot ${weight}/${MAX_WEIGHT} · ${label}`}>
      <Weight className="h-3.5 w-3.5" />
      <span className="flex gap-0.5" aria-hidden="true">
        {Array.from({ length: MAX_WEIGHT }, (_, i) => (
          <span key={i} className={clsx('h-1.5 w-3 rounded-full', i < weight ? 'bg-ink-soft' : 'bg-stone-200')} />
        ))}
      </span>
      <span className="sr-only">{`Bobot ${weight} dari ${MAX_WEIGHT}`}</span>
    </span>
  )
}

function countdownTone(priority) {
  if (priority.overdue) return 'text-rose-600'
  if (priority.daysLeft <= 1) return 'text-orange-600'
  return 'text-ink-soft'
}

export default function TaskCard({ task, highlightTerms = [] }) {
  const [expanded, setExpanded] = useState(false)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')

  const setStatus = useTaskStore((s) => s.setStatus)
  const toggleSubtask = useTaskStore((s) => s.toggleSubtask)
  const addSubtask = useTaskStore((s) => s.addSubtask)
  const removeSubtask = useTaskStore((s) => s.removeSubtask)

  const { openTaskForm, askDelete } = useUiStore()
  const { priority } = task
  const done = task.status === STATUS.SELESAI
  const styles = PRIORITY_STYLES[priority.level]

  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : []
  const { done: subDone, total: subTotal, percent: subPercent } = progressOf(task)

  const handleAddSubtask = (e) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    addSubtask(task.id, newSubtaskTitle)
    setNewSubtaskTitle('')
  }

  return (
    <article
      className={clsx(
        'card group relative overflow-hidden transition duration-200 hover:shadow-lift',
        done && 'bg-white/60',
      )}
    >
      <span className={clsx('absolute inset-y-0 left-0 w-1', styles.bar)} aria-hidden="true" />

      <div className="flex flex-col gap-4 p-5 pl-6 lg:flex-row lg:items-center lg:gap-6">
        <div
          className={clsx('hidden h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl lg:flex', styles.score)}
          title="Skor prioritas"
        >
          <span className="text-lg font-extrabold leading-none tabular-nums">{Math.round(priority.score)}</span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider opacity-70">skor</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold tracking-wide text-ink-soft">
              <Highlight text={task.courseCode} terms={highlightTerms} />
            </span>
            {findCourse(task.courseCode) && (
              <span className="text-xs font-semibold text-ink-soft">
                <Highlight text={findCourse(task.courseCode).name} terms={highlightTerms} />
              </span>
            )}
            <PriorityBadge level={priority.level} />
            <span className="ml-auto text-xs font-bold tabular-nums lg:hidden">Skor {Math.round(priority.score)}</span>
          </div>

          <h3 className={clsx('text-base font-bold leading-snug', done && 'text-ink-mute line-through')}>
            <Highlight text={task.title} terms={highlightTerms} />
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatRange(task.startDate, task.deadline)}
            </span>
            {!done && (
              <span className={clsx('font-semibold', countdownTone(priority))}>
                {describeCountdown(priority.daysLeft)}
              </span>
            )}
            <WeightMeter weight={task.weight} />

            {/* Progres Subtugas */}
            {subTotal > 0 && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 font-semibold text-ink">
                  <CheckSquare className="h-3.5 w-3.5 text-brand-600" />
                  <span>
                    {subDone}/{subTotal}
                  </span>
                </span>
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className={clsx('h-full transition-all duration-300', subPercent === 100 ? 'bg-emerald-500' : 'bg-brand-600')}
                    style={{ width: `${subPercent}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-1 font-semibold text-brand-700 transition hover:text-brand-800"
            >
              <span>{subTotal > 0 ? `Subtugas (${subDone}/${subTotal})` : 'Tambah subtugas'}</span>
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 lg:justify-end">
          <StatusToggle value={task.status} onChange={(status) => setStatus(task.id, status)} />
          <div className="flex gap-0.5">
            <Button variant="ghost" icon onClick={() => openTaskForm(task)} aria-label={`Edit ${task.title}`}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              icon
              onClick={() => askDelete(task)}
              aria-label={`Hapus ${task.title}`}
              className="hover:!bg-rose-50 hover:!text-rose-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Bagian Expandable Subtugas */}
      {expanded && (
        <div className="border-t border-line bg-stone-50/60 p-4 pl-6 sm:pl-8">
          <p className="text-xs font-bold text-ink">Checklist Tahapan / Subtugas:</p>

          <div className="mt-2.5 space-y-1.5">
            {subtasks.map((st) => (
              <div
                key={st.id}
                className="group/sub flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-xs shadow-xs ring-1 ring-line"
              >
                <label className="flex flex-1 cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={st.done}
                    onChange={() => toggleSubtask(task.id, st.id)}
                    className="h-4 w-4 rounded-md accent-brand-600 cursor-pointer"
                  />
                  <span className={clsx('font-medium leading-tight', st.done && 'text-ink-mute line-through')}>
                    {st.title}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => removeSubtask(task.id, st.id)}
                  title="Hapus subtugas"
                  aria-label={`Hapus subtugas ${st.title}`}
                  className="rounded-md p-1 text-ink-mute opacity-0 transition group-hover/sub:opacity-100 hover:bg-rose-50 hover:text-rose-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            {subtasks.length === 0 && (
              <p className="py-1 text-xs text-ink-mute italic">Belum ada tahapan subtugas untuk tugas ini.</p>
            )}
          </div>

          {/* Form inline tambah subtugas */}
          {subtasks.length < MAX_SUBTASKS ? (
            <form onSubmit={handleAddSubtask} className="mt-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Tambah subtugas baru (lalu tekan Enter)..."
                maxLength={80}
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="input !py-1.5 text-xs flex-1"
              />
              <Button variant="secondary" type="submit" disabled={!newSubtaskTitle.trim()} className="!py-1.5 text-xs">
                <Plus className="h-3.5 w-3.5" /> Tambah
              </Button>
            </form>
          ) : (
            <p className="mt-2 text-[11px] font-medium text-amber-700">
              Telah mencapai batas maksimal {MAX_SUBTASKS} subtugas.
            </p>
          )}
        </div>
      )}
    </article>
  )
}
