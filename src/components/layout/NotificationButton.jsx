import { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { Bell, BellOff, BellRing, Clock } from 'lucide-react'
import { useNotificationPermission } from '../../hooks/useNotificationPermission'
import { useToday } from '../../hooks/useToday'
import { requestPermission, showTaskNotification } from '../../lib/browserNotify'
import { collectActiveReminders } from '../../lib/reminders'
import { useSettingsStore } from '../../store/settingsStore'
import { useTaskStore } from '../../store/taskStore'
import { toast } from '../../store/toastStore'
import Button from '../ui/Button'

const STATUS_TEXT = {
  unsupported: 'Browser ini tidak mendukung notifikasi.',
  denied: 'Diblokir di browser.',
  default: 'Belum diizinkan.',
}

const STAGE_BADGE = {
  H: 'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  'H-1': 'bg-amber-100 text-amber-800 ring-1 ring-amber-200',
  'H-3': 'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
}

function formatNotifiedTime(iso) {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

// Tombol lonceng + panel daftar pengingat deadline (H-3, H-1, Hari H) & pengaturan notifikasi browser
export default function NotificationButton() {
  const [open, setOpen] = useState(false)
  const [permission, setPermission] = useNotificationPermission()
  const enabledSetting = useSettingsStore((s) => s.browserNotifications)
  const setEnabled = useSettingsStore((s) => s.setBrowserNotifications)
  const tasks = useTaskStore((s) => s.tasks)
  const notified = useTaskStore((s) => s.notified)
  const today = useToday()
  const wrapRef = useRef(null)

  const activeReminders = useMemo(
    () => collectActiveReminders(tasks, today, notified),
    [tasks, today, notified],
  )

  const granted = permission === 'granted'
  const active = granted && enabledSetting
  const Icon = active || activeReminders.length > 0 ? BellRing : granted || permission === 'default' ? Bell : BellOff

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => !wrapRef.current?.contains(event.target) && setOpen(false)
    const onKeyDown = (event) => event.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleEnable = async () => {
    const result = await requestPermission()
    setPermission(result)
    if (result === 'granted') {
      setEnabled(true)
      toast.success('Notifikasi browser aktif', 'Pengingat muncul saat TugasKu terbuka di tab yang tidak sedang dilihat.')
    } else if (result === 'denied') {
      toast.error('Izin ditolak', 'Ubah lewat pengaturan situs di browser untuk mengaktifkannya.')
    }
  }

  const sendTest = () => {
    const ok = showTaskNotification({
      title: 'Notifikasi uji coba',
      body: 'Notifikasi TugasKu berfungsi.',
      tag: 'tugasku-test',
    })
    if (!ok) toast.error('Gagal mengirim notifikasi', 'Periksa izin notifikasi di browser.')
  }

  return (
    <div ref={wrapRef} className="relative">
      <Button
        variant="secondary"
        icon
        id="notification-button"
        aria-label="Pengingat deadline dan notifikasi"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className={clsx('relative', (active || activeReminders.length > 0) && 'text-brand-700')}
      >
        <Icon className="h-4 w-4" />
        {activeReminders.length > 0 && (
          <span
            aria-label={`${activeReminders.length} pengingat deadline aktif`}
            className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-extrabold text-white"
          >
            {activeReminders.length}
          </span>
        )}
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Pengingat deadline dan notifikasi"
          className="absolute right-0 top-full z-40 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white p-4 shadow-lift"
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold">Pengingat Deadline (H-3, H-1, H)</h2>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-bold text-ink-soft">
                {activeReminders.length} aktif
              </span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Daftar tugas belum selesai yang berada pada tahapan pengingat H-3, H-1, atau hari H.
            </p>

            {activeReminders.length === 0 ? (
              <p className="mt-3 rounded-xl bg-stone-50 px-3 py-3 text-center text-xs text-ink-mute">
                Belum ada tugas yang memasuki jadwal pengingat H-3, H-1, atau hari H.
              </p>
            ) : (
              <ul className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
                {activeReminders.map((item) => {
                  const timeStr = formatNotifiedTime(item.notifiedAt)
                  return (
                    <li
                      key={item.key}
                      className="rounded-xl border border-line bg-stone-50/70 p-2.5 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={clsx(
                            'rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase',
                            STAGE_BADGE[item.stage.id],
                          )}
                        >
                          {item.stage.id === 'H' ? 'Hari H' : item.stage.id}
                        </span>
                        <span className="font-semibold text-ink-soft">{item.when}</span>
                      </div>
                      <p className="mt-1.5 font-bold text-ink leading-snug">
                        {item.task.courseCode} · {item.task.title}
                      </p>
                      {timeStr && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-ink-mute">
                          <Clock className="h-3 w-3" />
                          <span>Tercatat pada {timeStr}</span>
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          <div className="mt-4 border-t border-line pt-3">
            <h3 className="text-xs font-bold text-ink">Notifikasi Desktop Browser</h3>
            <p className="mt-0.5 text-[11px] leading-relaxed text-ink-soft">
              Kirim juga ke notifikasi desktop saat tab TugasKu sedang tidak dilihat.
            </p>

            {granted ? (
              <label className="mt-2.5 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-stone-50 px-3 py-2">
                <span className="text-xs font-semibold">{enabledSetting ? 'Aktif' : 'Nonaktif'}</span>
                <input
                  id="notification-toggle"
                  type="checkbox"
                  role="switch"
                  className="h-4 w-4 accent-brand-600"
                  checked={enabledSetting}
                  onChange={(event) => setEnabled(event.target.checked)}
                />
              </label>
            ) : (
              <p className="mt-2.5 rounded-xl bg-stone-50 px-3 py-2 text-xs font-semibold" role="status">
                {STATUS_TEXT[permission] ?? STATUS_TEXT.default}
              </p>
            )}

            {permission === 'default' && (
              <Button variant="primary" className="mt-2.5 w-full !py-2 text-xs" onClick={handleEnable}>
                <BellRing className="h-3.5 w-3.5" /> Aktifkan notifikasi browser
              </Button>
            )}

            {permission === 'denied' && (
              <p className="mt-2 text-[11px] leading-relaxed text-ink-soft">
                Klik ikon gembok/pengaturan di sebelah alamat situs, ubah <b>Notifikasi</b> menjadi{' '}
                <b>Izinkan</b>, lalu muat ulang halaman.
              </p>
            )}

            {active && (
              <Button variant="ghost" className="mt-2 w-full !py-1.5 text-xs" onClick={sendTest}>
                Kirim notifikasi uji coba
              </Button>
            )}

            <p className="mt-2.5 border-t border-line pt-2.5 text-[10px] leading-relaxed text-ink-mute">
              Sesuai batasan sistem: pemeriksaan pengingat dilakukan di dalam aplikasi saat dibuka dan berkala
              selama aplikasi aktif (tanpa layanan push server eksternal).
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
