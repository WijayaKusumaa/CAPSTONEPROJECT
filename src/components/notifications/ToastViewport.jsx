import clsx from 'clsx'
import { AlarmClock, BellRing, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { useToastStore } from '../../store/toastStore'

const VARIANTS = {
  danger: { icon: BellRing, bubble: 'bg-rose-100 text-rose-600', bar: 'bg-rose-500' },
  warning: { icon: AlarmClock, bubble: 'bg-orange-100 text-orange-600', bar: 'bg-orange-400' },
  info: { icon: TriangleAlert, bubble: 'bg-sky-100 text-sky-600', bar: 'bg-sky-500' },
  success: { icon: CheckCircle2, bubble: 'bg-emerald-100 text-emerald-600', bar: 'bg-emerald-500' },
  neutral: { icon: Info, bubble: 'bg-stone-100 text-stone-600', bar: 'bg-stone-400' },
}

function Toast({ toast, onDismiss }) {
  const { icon: Icon, bubble, bar } = VARIANTS[toast.variant] ?? VARIANTS.neutral

  return (
    <div
      role="status"
      className="group pointer-events-auto relative w-full animate-toast-in overflow-hidden rounded-2xl border border-line bg-white shadow-toast"
    >
      <div className="flex items-start gap-3 p-4 pr-3">
        <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', bubble)}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="text-sm font-bold leading-tight">{toast.title}</p>
          {toast.message && <p className="mt-1 text-sm leading-snug text-ink-soft">{toast.message}</p>}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Tutup notifikasi"
          className="rounded-lg p-1.5 text-ink-mute transition hover:bg-stone-100 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Bar durasi waktu toast */}
      <div className="h-0.5 bg-stone-100">
        <div
          className={clsx('h-full origin-left group-hover:[animation-play-state:paused]', bar)}
          style={{ animation: `toast-progress ${toast.duration}ms linear forwards` }}
          onAnimationEnd={() => onDismiss(toast.id)}
        />
      </div>
    </div>
  )
}

export default function ToastViewport() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col gap-3 p-4 sm:left-auto sm:w-[26rem] sm:p-6"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </div>
  )
}
