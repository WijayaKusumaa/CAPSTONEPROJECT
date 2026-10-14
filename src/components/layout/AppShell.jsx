import clsx from 'clsx'
import { CalendarDays, CheckCheck, GraduationCap, LayoutList, Plus, Upload } from 'lucide-react'
import { PAGES } from '../../hooks/useHashPage'
import { useSettingsStore } from '../../store/settingsStore'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import ExportMenu from './ExportMenu'
import NotificationButton from './NotificationButton'

const NAV = [
  { id: PAGES.DASHBOARD, label: 'Dashboard', icon: LayoutList },
  { id: PAGES.CALENDAR, label: 'Kalender', icon: CalendarDays },
]

export default function AppShell({ page, onNavigate, children }) {
  const openTaskForm = useUiStore((s) => s.openTaskForm)
  const openImport = useUiStore((s) => s.openImport)
  const activeSemester = useSettingsStore((s) => s.activeSemester)
  const setActiveSemester = useSettingsStore((s) => s.setActiveSemester)

  return (
    <div className="min-h-screen pb-24 sm:pb-12">
      <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
          <a href="#/" className="flex items-center gap-2.5" aria-label="TugasKu — beranda">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white">
              <CheckCheck className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-extrabold tracking-tight">TugasKu</span>
          </a>

          <nav className="hidden gap-1 sm:flex" aria-label="Navigasi utama">
            {NAV.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={page === id ? 'page' : undefined}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition',
                  page === id ? 'bg-white text-ink shadow-card ring-1 ring-line' : 'text-ink-soft hover:text-ink',
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-ink-soft shadow-sm"
              title="Filter semester aktif Anda untuk mempercepat pemilihan mata kuliah di form tugas"
            >
              <GraduationCap className="h-4 w-4 shrink-0 text-brand-600" />
              <select
                id="active-semester"
                aria-label="Semester aktif"
                value={activeSemester ?? ''}
                onChange={(e) => setActiveSemester(e.target.value)}
                className="cursor-pointer bg-transparent font-semibold text-ink focus:outline-none"
              >
                <option value="">Semua Sem.</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Sem. {s}
                  </option>
                ))}
              </select>
            </div>

            <NotificationButton />
            <ExportMenu onNavigate={onNavigate} />
            <Button variant="secondary" onClick={openImport} aria-label="Import data" className="max-sm:btn-icon">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="primary" onClick={() => openTaskForm()} aria-label="Tambah tugas" className="max-sm:btn-icon">
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">Tambah tugas</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 pt-8 sm:px-6">{children}</main>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-line bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md sm:hidden"
        aria-label="Navigasi utama"
      >
        {NAV.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
            aria-current={page === id ? 'page' : undefined}
            className={clsx(
              'flex flex-col items-center gap-1 py-3 text-xs font-semibold transition',
              page === id ? 'text-brand-700' : 'text-ink-mute',
            )}
          >
            <Icon className="h-5 w-5" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
