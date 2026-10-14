import { CalendarClock, Flame, Target } from 'lucide-react'
import { STATUS } from '../../lib/constants'
import { describeCountdown, formatDate } from '../../lib/dates'
import PriorityBadge from './PriorityBadge'

function StatCard({ icon: Icon, label, children }) {
  return (
    <section className="card p-5">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-mute">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      {children}
    </section>
  )
}

function Highlight({ task, meta }) {
  if (!task) return <p className="text-sm text-ink-soft">Tidak ada tugas aktif 🎉</p>
  return (
    <>
      <p className="truncate text-base font-bold leading-snug">{task.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
        <span className="rounded-md bg-stone-100 px-2 py-0.5 font-bold">{task.courseCode}</span>
        {meta}
      </div>
    </>
  )
}

// Tampilan ringkasan: progres persentase, tugas prioritas utama, dan deadline terdekat
export default function SummaryCards({ tasks }) {
  const total = tasks.length
  const done = tasks.filter((t) => t.status === STATUS.SELESAI).length
  const percent = total ? Math.round((done / total) * 100) : 0

  const active = tasks.filter((t) => t.status !== STATUS.SELESAI)
  const topPriority = active[0] // tasks sudah terurut dari skor tertinggi
  const nearest = [...active].sort((a, b) => a.priority.daysLeft - b.priority.daysLeft)[0]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard icon={Target} label="Progres">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-extrabold tracking-tight tabular-nums">{percent}%</span>
          <span className="text-sm text-ink-soft">
            {done} dari {total} selesai
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </StatCard>

      <StatCard icon={Flame} label="Prioritas tertinggi">
        <Highlight
          task={topPriority}
          meta={topPriority && <PriorityBadge level={topPriority.priority.level} />}
        />
      </StatCard>

      <StatCard icon={CalendarClock} label="Deadline terdekat">
        <Highlight
          task={nearest}
          meta={
            nearest && (
              <>
                <span className="font-semibold text-ink">{describeCountdown(nearest.priority.daysLeft)}</span>
                <span>· {formatDate(nearest.deadline, { day: 'numeric', month: 'short' })}</span>
              </>
            )
          }
        />
      </StatCard>
    </div>
  )
}
