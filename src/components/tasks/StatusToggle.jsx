import clsx from 'clsx'
import { STATUS, STATUS_OPTIONS } from '../../lib/constants'

const ACTIVE_STYLE = {
  [STATUS.BELUM]: 'bg-stone-700 text-white',
  [STATUS.SEDANG]: 'bg-sky-600 text-white',
  [STATUS.SELESAI]: 'bg-emerald-600 text-white',
}

// Tombol opsi pilihan status tugas (Belum, Sedang, Selesai)
export default function StatusToggle({ value, onChange, className }) {
  return (
    <div
      role="radiogroup"
      aria-label="Status tugas"
      className={clsx('inline-flex rounded-full bg-stone-100 p-1', className)}
    >
      {STATUS_OPTIONS.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => !active && onChange(option.value)}
            className={clsx(
              'rounded-full px-3 py-1 text-xs font-semibold transition-all duration-200',
              active ? [ACTIVE_STYLE[option.value], 'shadow-sm'] : 'text-ink-soft hover:text-ink',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
