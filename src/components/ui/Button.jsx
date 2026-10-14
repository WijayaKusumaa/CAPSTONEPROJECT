import clsx from 'clsx'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

// Komponen tombol dasar
export default function Button({ variant = 'secondary', icon = false, className, children, ...props }) {
  return (
    <button
      type="button"
      className={clsx('btn', VARIANTS[variant], icon && 'btn-icon', className)}
      {...props}
    >
      {children}
    </button>
  )
}
