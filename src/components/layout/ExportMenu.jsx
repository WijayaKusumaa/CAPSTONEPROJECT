import { useEffect, useRef, useState } from 'react'
import { Download, FileJson, FileSpreadsheet, Printer } from 'lucide-react'
import { PAGES } from '../../hooks/useHashPage'
import { downloadTextFile } from '../../lib/download'
import { buildExportFilename, tasksToBackupJson, tasksToCsv } from '../../lib/export'
import { useTaskStore } from '../../store/taskStore'
import { toast } from '../../store/toastStore'
import Button from '../ui/Button'

export default function ExportMenu({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const tasks = useTaskStore((s) => s.tasks)
  const hasTasks = tasks.length > 0

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => !menuRef.current?.contains(e.target) && setOpen(false)
    const onKeyDown = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleExportCsv = () => {
    const csvContent = tasksToCsv(tasks)
    const filename = buildExportFilename('tugasku', 'csv')
    downloadTextFile(filename, csvContent, 'text/csv;charset=utf-8')
    toast.success('Ekspor CSV berhasil', `${tasks.length} tugas berhasil diekspor ke file ${filename}.`)
    setOpen(false)
  }

  const handleBackupJson = () => {
    const jsonContent = tasksToBackupJson(tasks)
    const filename = buildExportFilename('backup-tugasku', 'json')
    downloadTextFile(filename, jsonContent, 'application/json;charset=utf-8')
    toast.success('Backup JSON berhasil', `${tasks.length} tugas berhasil disimpan dalam berkas ${filename}.`)
    setOpen(false)
  }

  const handlePrint = () => {
    setOpen(false)
    onNavigate?.(PAGES.PRINT)
  }

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="secondary"
        id="export-menu-button"
        aria-label="Ekspor data dan cetak jadwal"
        aria-expanded={open}
        aria-haspopup="menu"
        disabled={!hasTasks}
        title={!hasTasks ? 'Belum ada tugas untuk diekspor' : 'Ekspor seluruh tugas (tanpa terpengaruh filter)'}
        onClick={() => setOpen((prev) => !prev)}
        className="max-sm:btn-icon"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Ekspor</span>
      </Button>

      {open && (
        <div
          role="menu"
          aria-label="Pilihan Ekspor"
          className="absolute right-0 top-full z-40 mt-2 w-56 rounded-2xl border border-line bg-white p-1.5 shadow-lift"
        >
          <div className="border-b border-line px-3 py-2">
            <p className="text-xs font-bold text-ink">Ekspor Data ({tasks.length} Tugas)</p>
            <p className="text-[10px] text-ink-mute">Selalu mencakup seluruh tugas tanpa terpengaruh filter.</p>
          </div>

          <div className="py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleExportCsv}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-ink-soft transition hover:bg-stone-50 hover:text-ink"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
              <span>Ekspor ke CSV (.csv)</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handleBackupJson}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-ink-soft transition hover:bg-stone-50 hover:text-ink"
            >
              <FileJson className="h-4 w-4 text-brand-600" />
              <span>Backup Data (.json)</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={handlePrint}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-ink-soft transition hover:bg-stone-50 hover:text-ink"
            >
              <Printer className="h-4 w-4 text-amber-600" />
              <span>Cetak Jadwal Tugas</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
