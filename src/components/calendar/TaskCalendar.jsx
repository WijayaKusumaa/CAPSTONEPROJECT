import { useMemo } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import listPlugin from '@fullcalendar/list'
import interactionPlugin from '@fullcalendar/interaction'
import idLocale from '@fullcalendar/core/locales/id'
import { PRIORITY_LEVEL, PRIORITY_META } from '../../lib/constants'
import { addDays } from '../../lib/dates'
import { useUiStore } from '../../store/uiStore'
import { PRIORITY_STYLES } from '../tasks/priorityStyles'

const LEGEND = [PRIORITY_LEVEL.CRITICAL, PRIORITY_LEVEL.HIGH, PRIORITY_LEVEL.MEDIUM, PRIORITY_LEVEL.LOW, PRIORITY_LEVEL.DONE]

const isMobile = () => typeof window !== 'undefined' && window.innerWidth < 640

// Tampilan kalender rentang pengerjaan tugas
export default function TaskCalendar({ tasks }) {
  const openTaskForm = useUiStore((s) => s.openTaskForm)

  const events = useMemo(
    () =>
      tasks.map((task) => ({
        id: task.id,
        title: `${task.courseCode} · ${task.title}`,
        start: task.startDate,
        end: addDays(task.deadline, 1), // Batas akhir FullCalendar bersifat eksklusif
        allDay: true,
        classNames: ['task-event', PRIORITY_STYLES[task.priority.level].event],
        extendedProps: { task },
      })),
    [tasks],
  )

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-soft">
        {LEGEND.map((level) => (
          <span key={level} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${PRIORITY_STYLES[level].bar}`} />
            {PRIORITY_META[level].label}
          </span>
        ))}
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, listPlugin, interactionPlugin]}
        initialView={isMobile() ? 'listMonth' : 'dayGridMonth'}
        headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' }}
        buttonText={{ today: 'Hari ini', month: 'Bulan', list: 'Daftar' }}
        locale={idLocale}
        firstDay={1}
        height="auto"
        events={events}
        dayMaxEvents={3}
        moreLinkText={(n) => `+${n} lagi`}
        noEventsText="Tidak ada tugas pada periode ini"
        eventClick={({ event }) => openTaskForm(event.extendedProps.task)}
      />
    </div>
  )
}
