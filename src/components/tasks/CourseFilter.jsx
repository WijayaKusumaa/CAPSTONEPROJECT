import { X } from 'lucide-react'
import { ALL } from '../../lib/courseFilter'

const selectClass =
  'input !w-auto max-w-full py-2 pr-9 text-sm font-semibold sm:max-w-[16rem]'

// Filter tugas berdasarkan semester dan mata kuliah
export default function CourseFilter({ groups, value, onChange }) {
  const activeGroup = groups.find((g) => g.key === value.group)
  const courses = activeGroup
    ? activeGroup.courses
    : groups.flatMap((g) => g.courses).sort((a, b) => a.code.localeCompare(b.code))
  const filtered = value.group !== ALL || value.course !== ALL

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter mata kuliah">
      <select
        id="filter-semester"
        aria-label="Filter semester"
        className={selectClass}
        value={value.group}
        onChange={(e) => onChange({ group: e.target.value, course: ALL })}
      >
        <option value={ALL}>Semua semester</option>
        {groups.map((g) => (
          <option key={g.key} value={g.key}>
            {g.label} ({g.count})
          </option>
        ))}
      </select>

      <select
        id="filter-course"
        aria-label="Filter mata kuliah"
        className={selectClass}
        value={value.course}
        onChange={(e) => onChange({ ...value, course: e.target.value })}
      >
        <option value={ALL}>Semua mata kuliah</option>
        {courses.map((c) => (
          <option key={c.code} value={c.code}>
            {c.name ? `${c.code} - ${c.name}` : c.code} ({c.count})
          </option>
        ))}
      </select>

      {filtered && (
        <button
          type="button"
          onClick={() => onChange({ group: ALL, course: ALL })}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-soft ring-1 ring-inset ring-line transition hover:text-ink"
        >
          <X className="h-3.5 w-3.5" /> Reset
        </button>
      )}
    </div>
  )
}
