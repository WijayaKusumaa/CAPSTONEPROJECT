import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { Bell, BellOff, BellRing } from 'lucide-react'
import { useNotificationPermission } from '../../hooks/useNotificationPermission'
import { requestPermission, showTaskNotification } from '../../lib/browserNotify'
import { useSettingsStore } from '../../store/settingsStore'
import { toast } from '../../store/toastStore'
import Button from '../ui/Button'

const STATUS_TEXT = {
  unsupported: 'Browser ini tidak mendukung notifikasi.',
  denied: 'Diblokir di browser.',
  default: 'Belum diizinkan.',
}

// Tombol lonceng + panel pengaturan notifikasi browser
export default function NotificationButton() {
  const [open, setOpen] = useState(false)
  const [permission, setPermission] = useNotificationPermission()
  const enabledSetting = useSettingsStore((s) => s.browserNotifications)
  const setEnabled = useSettingsStore((s) => s.setBrowserNotifications)
  const wrapRef = useRef(null)

  const granted = permission === 'granted'
  const active = granted && enabledSetting
  const Icon = active ? BellRing : granted || permission === 'default' ? Bell : BellOff

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
        aria-label="Pengaturan notifikasi browser"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className={clsx(active && 'text-brand-700')}
      >
        <Icon className="h-4 w-4" />
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifikasi browser"
          className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white p-4 shadow-lift"
        >
          <h2 className="text-sm font-bold">Notifikasi browser</h2>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Pengingat deadline (H-3, H-1, dan hari H) juga dikirim sebagai notifikasi desktop saat tab TugasKu
            sedang tidak kamu lihat.
          </p>

          {granted ? (
            <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-stone-50 px-3 py-2.5">
              <span className="text-sm font-semibold">{enabledSetting ? 'Aktif' : 'Nonaktif'}</span>
              <input
                id="notification-toggle"
                type="checkbox"
                role="switch"
                className="h-5 w-5 accent-brand-600"
                checked={enabledSetting}
                onChange={(event) => setEnabled(event.target.checked)}
              />
            </label>
          ) : (
            <p className="mt-3 rounded-xl bg-stone-50 px-3 py-2.5 text-sm font-semibold" role="status">
              {STATUS_TEXT[permission] ?? STATUS_TEXT.default}
            </p>
          )}

          {permission === 'default' && (
            <Button variant="primary" className="mt-3 w-full" onClick={handleEnable}>
              <BellRing className="h-4 w-4" /> Aktifkan notifikasi
            </Button>
          )}

          {permission === 'denied' && (
            <p className="mt-2 text-xs leading-relaxed text-ink-soft">
              Klik ikon gembok/pengaturan di sebelah alamat situs, ubah <b>Notifikasi</b> menjadi{' '}
              <b>Izinkan</b>, lalu muat ulang halaman.
            </p>
          )}

          {active && (
            <Button variant="ghost" className="mt-2 w-full" onClick={sendTest}>
              Kirim notifikasi uji coba
            </Button>
          )}

          <p className="mt-3 border-t border-line pt-3 text-[11px] leading-relaxed text-ink-mute">
            Catatan: ini bukan push notification dari server. Notifikasi hanya muncul selama TugasKu terbuka di
            browser; jika semua tab/jendela ditutup, tidak ada pengingat.
          </p>
        </div>
      )}
    </div>
  )
}
