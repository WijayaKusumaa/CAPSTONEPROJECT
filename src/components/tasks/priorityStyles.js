import { PRIORITY_LEVEL } from '../../lib/constants'

// Konfigurasi styling warna untuk masing-masing level prioritas
export const PRIORITY_STYLES = {
  [PRIORITY_LEVEL.CRITICAL]: {
    bar: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 ring-rose-200',
    score: 'bg-rose-50 text-rose-700',
    event: 'task-event--critical',
  },
  [PRIORITY_LEVEL.HIGH]: {
    bar: 'bg-orange-400',
    badge: 'bg-orange-50 text-orange-700 ring-orange-200',
    score: 'bg-orange-50 text-orange-700',
    event: 'task-event--high',
  },
  [PRIORITY_LEVEL.MEDIUM]: {
    bar: 'bg-amber-300',
    badge: 'bg-amber-50 text-amber-700 ring-amber-200',
    score: 'bg-amber-50 text-amber-700',
    event: 'task-event--medium',
  },
  [PRIORITY_LEVEL.LOW]: {
    bar: 'bg-brand-300',
    badge: 'bg-brand-50 text-brand-700 ring-brand-200',
    score: 'bg-brand-50 text-brand-700',
    event: 'task-event--low',
  },
  [PRIORITY_LEVEL.DONE]: {
    bar: 'bg-stone-300',
    badge: 'bg-stone-100 text-stone-500 ring-stone-200',
    score: 'bg-stone-100 text-stone-500',
    event: 'task-event--done',
  },
}
