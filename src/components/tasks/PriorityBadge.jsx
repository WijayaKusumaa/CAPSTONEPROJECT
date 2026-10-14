import clsx from 'clsx'
import { PRIORITY_META } from '../../lib/constants'
import { PRIORITY_STYLES } from './priorityStyles'

export default function PriorityBadge({ level, className }) {
  return (
    <span className={clsx('badge', PRIORITY_STYLES[level].badge, className)}>
      {PRIORITY_META[level].label}
    </span>
  )
}
