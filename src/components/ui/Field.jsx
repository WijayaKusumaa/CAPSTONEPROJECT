import clsx from 'clsx'

// Komponen pembungkus label input form dan pesan error
export default function Field({ label, htmlFor, error, hint, className, children }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : (
        hint && <p className={clsx('mt-1.5 text-xs text-ink-mute')}>{hint}</p>
      )}
    </div>
  )
}
