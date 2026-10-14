import clsx from 'clsx'
import { STATUS_OPTIONS } from '../../lib/constants'

const FILTERS = [{ value: 'all', label: 'Semua' }, ...STATUS_OPTIONS]

// Filter tab untuk menampilkan tugas berdasarkan status
export default function StatusFilter({ value, onChange, counts }) {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter status">
      {FILTERS.map((filter) => {
        const active = filter.value === value
        return (
          <button
            key={filter.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(filter.value)}
            className={clsx(
              'inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold transition',
              active ? 'bg-ink text-white' : 'bg-white text-ink-soft ring-1 ring-inset ring-line hover:text-ink',
            )}
          >
            {filter.label}
            <span className={clsx('text-xs tabular-nums', active ? 'text-white/70' : 'text-ink-mute')}>
              {counts[filter.value] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}
