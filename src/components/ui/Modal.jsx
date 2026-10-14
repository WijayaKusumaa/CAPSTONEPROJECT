import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { X } from 'lucide-react'
import Button from './Button'

const SIZES = { md: 'max-w-lg', lg: 'max-w-2xl' }

// Komponen modal dialog
export default function Modal({ open, onClose, title, description, size = 'md', children }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => event.key === 'Escape' && onClose()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-40 flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-stone-900/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={clsx(
          'relative flex max-h-[92vh] w-full animate-pop-in flex-col rounded-t-3xl bg-white shadow-lift sm:rounded-3xl',
          SIZES[size],
        )}
      >
        <header className="flex items-start justify-between gap-4 px-6 pb-2 pt-6">
          <div>
            <h2 id="modal-title" className="text-lg font-bold tracking-tight">
              {title}
            </h2>
            {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
          </div>
          <Button variant="ghost" icon onClick={onClose} aria-label="Tutup dialog" className="-mr-2 -mt-1">
            <X className="h-5 w-5" />
          </Button>
        </header>
        <div className="overflow-y-auto px-6 pb-6 pt-3">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
