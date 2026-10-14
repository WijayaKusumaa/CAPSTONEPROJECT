import { useMemo, useState } from 'react'
import { ClipboardList, FlaskConical, Upload, Plus, SearchX, Trash2 } from 'lucide-react'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import CourseFilter from '../components/tasks/CourseFilter'
import SearchInput from '../components/tasks/SearchInput'
import StatusFilter from '../components/tasks/StatusFilter'
import SummaryCards from '../components/tasks/SummaryCards'
import TaskCard from '../components/tasks/TaskCard'
import { useRankedTasks } from '../hooks/useRankedTasks'
import { ALL, buildCourseGroups, filterByCourse, sanitizeCourseFilter } from '../lib/courseFilter'
import { formatLongToday } from '../lib/dates'
import { getSearchTerms, searchTasks } from '../lib/searchTasks'
import { buildSampleTasks } from '../lib/sampleTasks'
import { useTaskStore } from '../store/taskStore'
import { useUiStore } from '../store/uiStore'

function PageHeading({ title, subtitle }) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
      <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
    </div>
  )
}

function OnboardingEmpty({ today }) {
  const openTaskForm = useUiStore((s) => s.openTaskForm)
  const openImport = useUiStore((s) => s.openImport)
  const addTasks = useTaskStore((s) => s.addTasks)

  return (
    <EmptyState
      icon={ClipboardList}
      title="Belum ada tugas"
      description="Tambahkan tugas pertamamu secara manual, impor dari CSV, atau coba dulu dengan data contoh."
    >
      <Button variant="primary" onClick={() => openTaskForm()}>
        <Plus className="h-4 w-4" /> Tambah tugas
      </Button>
      <Button onClick={openImport}>
        <Upload className="h-4 w-4" /> Import CSV
      </Button>
      <Button variant="ghost" onClick={() => addTasks(buildSampleTasks(today))}>
        <FlaskConical className="h-4 w-4" /> Muat data contoh
      </Button>
    </EmptyState>
  )
}

export default function DashboardPage() {
  const { ranked, today } = useRankedTasks()
  const [filter, setFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState({ group: ALL, course: ALL })
  const [query, setQuery] = useState('')
  const clearTasks = useTaskStore((s) => s.clearTasks)

  const handleClear = () => {
    if (window.confirm('Hapus semua tugas? Tindakan ini tidak bisa dibatalkan.')) clearTasks()
  }

  const groups = useMemo(() => buildCourseGroups(ranked), [ranked])
  const activeCourseFilter = useMemo(() => sanitizeCourseFilter(courseFilter, groups), [courseFilter, groups])
  const scopedByCourse = useMemo(() => filterByCourse(ranked, activeCourseFilter), [ranked, activeCourseFilter])
  const scoped = useMemo(() => searchTasks(scopedByCourse, query), [scopedByCourse, query])
  const highlightTerms = useMemo(() => getSearchTerms(query), [query])
  const searching = highlightTerms.length > 0

  const counts = useMemo(
    () => ({
      all: scoped.length,
      belum: scoped.filter((t) => t.status === 'belum').length,
      sedang: scoped.filter((t) => t.status === 'sedang').length,
      selesai: scoped.filter((t) => t.status === 'selesai').length,
    }),
    [scoped],
  )

  const visible = filter === 'all' ? scoped : scoped.filter((t) => t.status === filter)

  return (
    <>
      <PageHeading title="Dashboard" subtitle={formatLongToday(today)} />

      {ranked.length === 0 ? (
        <OnboardingEmpty today={today} />
      ) : (
        <div className="space-y-8">
          <SummaryCards tasks={ranked} />

          <section aria-labelledby="task-list-title">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="task-list-title" className="text-lg font-bold tracking-tight">
                  Daftar tugas
                </h2>
                <p className="text-xs text-ink-mute">Diurutkan otomatis dari skor prioritas tertinggi</p>
              </div>
              <Button variant="ghost" onClick={handleClear}>
                <Trash2 className="h-4 w-4" /> Hapus semua
              </Button>
            </div>

            <div className="mb-4 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <CourseFilter groups={groups} value={activeCourseFilter} onChange={setCourseFilter} />
                <SearchInput value={query} onChange={setQuery} />
              </div>
              <StatusFilter value={filter} onChange={setFilter} counts={counts} />
            </div>

            {visible.length === 0 ? (
              searching && scoped.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title={`Tidak ada tugas untuk "${query.trim()}"`}
                  description="Coba kata kunci lain, atau periksa filter semester/mata kuliah yang aktif."
                >
                  <Button onClick={() => setQuery('')}>Hapus pencarian</Button>
                </EmptyState>
              ) : (
                <EmptyState
                  icon={SearchX}
                  title="Tidak ada tugas di filter ini"
                  description="Ubah status atau mata kuliah yang dipilih untuk melihat daftar tugas lain."
                />
              )
            ) : (
              <div className="space-y-3">
                {visible.map((task) => (
                  <TaskCard key={task.id} task={task} highlightTerms={highlightTerms} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}
