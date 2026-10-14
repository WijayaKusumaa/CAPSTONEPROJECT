import { useRef, useState } from 'react'
import clsx from 'clsx'
import { AlertTriangle, CheckCircle2, Download, FileJson, FileSpreadsheet, RefreshCw, UploadCloud } from 'lucide-react'
import { CSV_TEMPLATE, parseTasksCsv } from '../../lib/csv'
import { formatDate } from '../../lib/dates'
import { downloadTextFile } from '../../lib/download'
import { parseBackupJson } from '../../lib/export'
import { useTaskStore } from '../../store/taskStore'
import { toast } from '../../store/toastStore'
import { useUiStore } from '../../store/uiStore'
import Button from '../ui/Button'
import Modal from '../ui/Modal'

const PREVIEW_LIMIT = 5

function Dropzone({ onFile }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const pick = (file) => file && onFile(file)

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        pick(e.dataTransfer.files?.[0])
      }}
      className={clsx(
        'flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition',
        dragging ? 'border-brand-500 bg-brand-50' : 'border-stone-300 bg-stone-50/60',
      )}
    >
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-card">
        <UploadCloud className="h-6 w-6" />
      </span>
      <p className="text-sm font-semibold">Tarik file CSV atau JSON ke sini</p>
      <p className="mt-1 text-xs text-ink-soft">atau pilih dari perangkat Anda (.csv, .json)</p>
      <Button variant="secondary" className="mt-4" onClick={() => inputRef.current?.click()}>
        Pilih file
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv,.json,application/json"
        className="hidden"
        aria-label="Pilih file CSV atau JSON"
        onChange={(e) => {
          pick(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

function Preview({ fileName, isJson, result, replaceMode, setReplaceMode }) {
  const { valid, errors } = result
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-ink-soft">
        {isJson ? <FileJson className="h-4 w-4 text-brand-600" /> : <FileSpreadsheet className="h-4 w-4 text-emerald-600" />}
        <span className="truncate font-medium text-ink">{fileName}</span>
        <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-bold uppercase text-ink-soft">
          {isJson ? 'Backup JSON' : 'Spreadsheet CSV'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3.5 text-emerald-800">
          <CheckCircle2 className="mb-1.5 h-4 w-4" />
          <p className="text-2xl font-extrabold leading-none">{valid.length}</p>
          <p className="mt-1 text-xs font-semibold">Tugas valid</p>
        </div>
        <div className={clsx('rounded-xl p-3.5', errors.length ? 'bg-rose-50 text-rose-800' : 'bg-stone-100 text-ink-soft')}>
          <AlertTriangle className="mb-1.5 h-4 w-4" />
          <p className="text-2xl font-extrabold leading-none">{errors.length}</p>
          <p className="mt-1 text-xs font-semibold">Baris dilewati</p>
        </div>
      </div>

      {isJson && (
        <div className="rounded-xl border border-line bg-stone-50/70 p-3.5">
          <p className="text-xs font-bold text-ink">Metode Pemulihan Data:</p>
          <div className="mt-2 space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-ink-soft hover:text-ink">
              <input
                type="radio"
                name="import-mode"
                checked={!replaceMode}
                onChange={() => setReplaceMode(false)}
                className="accent-brand-600"
              />
              <span><b>Gabungkan</b> dengan tugas yang sudah ada</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-rose-700 hover:text-rose-800">
              <input
                type="radio"
                name="import-mode"
                checked={replaceMode}
                onChange={() => setReplaceMode(true)}
                className="accent-rose-600"
              />
              <span><b>Ganti semua</b> tugas (hapus tugas lama lalu isi data backup ini)</span>
            </label>
          </div>
        </div>
      )}

      {valid.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-ink-mute">
              <tr>
                <th className="px-3 py-2 font-semibold">Kode</th>
                <th className="px-3 py-2 font-semibold">Tugas</th>
                <th className="hidden px-3 py-2 font-semibold sm:table-cell">Deadline</th>
                <th className="px-3 py-2 text-right font-semibold">Bobot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {valid.slice(0, PREVIEW_LIMIT).map((task, i) => (
                <tr key={i}>
                  <td className="px-3 py-2 font-bold">{task.courseCode}</td>
                  <td className="max-w-[10rem] truncate px-3 py-2 sm:max-w-xs">{task.title}</td>
                  <td className="hidden px-3 py-2 sm:table-cell">
                    {formatDate(task.deadline, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{task.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {valid.length > PREVIEW_LIMIT && (
            <p className="border-t border-line bg-stone-50 px-3 py-2 text-xs text-ink-mute">
              + {valid.length - PREVIEW_LIMIT} tugas lainnya
            </p>
          )}
        </div>
      )}

      {errors.length > 0 && (
        <ul className="max-h-32 space-y-1.5 overflow-y-auto rounded-xl bg-rose-50/60 p-3 text-xs text-rose-800">
          {errors.map(({ row, messages }) => (
            <li key={row}>
              <span className="font-bold">Baris {row}:</span> {messages.join(' ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function CsvImportModal() {
  const open = useUiStore((s) => s.importOpen)
  const closeImport = useUiStore((s) => s.closeImport)
  const addTasks = useTaskStore((s) => s.addTasks)
  const clearTasks = useTaskStore((s) => s.clearTasks)

  const [fileName, setFileName] = useState('')
  const [isJson, setIsJson] = useState(false)
  const [result, setResult] = useState(null)
  const [replaceMode, setReplaceMode] = useState(false)

  const reset = () => {
    setFileName('')
    setIsJson(false)
    setResult(null)
    setReplaceMode(false)
  }

  const close = () => {
    reset()
    closeImport()
  }

  const handleFile = async (file) => {
    const name = file.name
    setFileName(name)
    const text = await file.text()
    const isJsonFile = name.toLowerCase().endsWith('.json') || text.trim().startsWith('{')

    setIsJson(isJsonFile)
    if (isJsonFile) {
      const parsed = parseBackupJson(text)
      setResult({
        valid: parsed.tasks,
        errors: parsed.errors,
        fatal: parsed.fatal,
      })
    } else {
      setResult(parseTasksCsv(text))
    }
  }

  const handleImport = () => {
    if (!result?.valid?.length) return

    if (isJson && replaceMode) {
      if (!window.confirm('PERINGATAN: Semua tugas lama akan dihapus dan digantikan dengan data backup ini. Lanjutkan?')) {
        return
      }
      clearTasks()
    }

    addTasks(result.valid)
    toast.success(
      isJson ? 'Pemulihan backup berhasil' : 'Import berhasil',
      `${result.valid.length} tugas berhasil dimasukkan.`,
    )
    close()
  }

  return (
    <Modal
      open={open}
      onClose={close}
      size="lg"
      title="Import tugas & pulihkan backup"
      description="Dukung format CSV (kode_mata_kuliah, nama_tugas, tanggal_mulai, deadline, bobot) atau berkas JSON Backup TugasKu."
    >
      <div className="space-y-4">
        {!result && <Dropzone onFile={handleFile} />}

        {result?.fatal && (
          <p role="alert" className="rounded-xl bg-rose-50 p-3.5 text-sm font-medium text-rose-800">
            {result.fatal}
          </p>
        )}
        {result && !result.fatal && (
          <Preview
            fileName={fileName}
            isJson={isJson}
            result={result}
            replaceMode={replaceMode}
            setReplaceMode={setReplaceMode}
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Button
            variant="ghost"
            onClick={() => downloadTextFile('template-tugas.csv', CSV_TEMPLATE)}
            className="-ml-2"
          >
            <Download className="h-4 w-4" />
            Unduh template CSV
          </Button>
          <div className="flex gap-2">
            {result && (
              <Button variant="secondary" onClick={reset}>
                Pilih ulang
              </Button>
            )}
            <Button
              variant={isJson && replaceMode ? 'danger' : 'primary'}
              onClick={handleImport}
              disabled={!result?.valid?.length}
            >
              {result?.valid?.length
                ? isJson && replaceMode
                  ? `Ganti semua (${result.valid.length} tugas)`
                  : `Impor ${result.valid.length} tugas`
                : 'Impor'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
