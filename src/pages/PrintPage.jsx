import { ArrowLeft, Printer } from 'lucide-react'
import { findCourse } from '../data/courses'
import { formatDate } from '../lib/dates'
import { useTaskStore } from '../store/taskStore'
import Button from '../components/ui/Button'

export default function PrintPage({ onBack }) {
  const tasks = useTaskStore((s) => s.tasks)

  // Urutkan tugas berdasarkan tanggal deadline terdekat
  const sortedTasks = [...tasks].sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''))

  return (
    <div className="space-y-6">
      {/* Kontrol aksi - disembunyikan saat mencetak */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Button>
        <Button variant="primary" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Cetak Jadwal Sekarang
        </Button>
      </div>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm print:border-none print:p-0 print:shadow-none">
        <div className="mb-6 border-b border-line pb-4 text-center">
          <h1 className="text-2xl font-black tracking-tight text-ink">Jadwal & Rekap Tugas Mahasiswa</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Dicetak pada: {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })} · Total: {sortedTasks.length} tugas
          </p>
        </div>

        {sortedTasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-soft">Tidak ada data tugas untuk dicetak.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b-2 border-stone-800 text-stone-900">
                <tr>
                  <th className="py-2.5 pr-2 font-bold">No.</th>
                  <th className="px-2 py-2.5 font-bold">Kode</th>
                  <th className="px-2 py-2.5 font-bold">Mata Kuliah</th>
                  <th className="px-2 py-2.5 font-bold">Nama Tugas</th>
                  <th className="px-2 py-2.5 font-bold">Mulai</th>
                  <th className="px-2 py-2.5 font-bold">Deadline</th>
                  <th className="px-2 py-2.5 text-center font-bold">Bobot</th>
                  <th className="py-2.5 pl-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-800">
                {sortedTasks.map((t, index) => {
                  const course = findCourse(t.courseCode)
                  return (
                    <tr key={t.id || index} className="break-inside-avoid">
                      <td className="py-2.5 pr-2 font-medium tabular-nums">{index + 1}</td>
                      <td className="px-2 py-2.5 font-bold uppercase">{t.courseCode}</td>
                      <td className="px-2 py-2.5 font-medium">{course?.name ?? '-'}</td>
                      <td className="px-2 py-2.5 font-semibold text-stone-900">{t.title}</td>
                      <td className="px-2 py-2.5 whitespace-nowrap text-stone-600">
                        {formatDate(t.startDate, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-2 py-2.5 whitespace-nowrap font-bold text-stone-900">
                        {formatDate(t.deadline, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-2 py-2.5 text-center font-bold">{t.weight}</td>
                      <td className="py-2.5 pl-2 capitalize font-medium">{t.status ?? 'belum'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 hidden border-t border-stone-300 pt-3 text-[11px] text-stone-500 print:block">
          Dihasilkan otomatis oleh TugasKu — Sistem Manajemen & Prioritas Tugas Mahasiswa.
        </div>
      </div>
    </div>
  )
}
