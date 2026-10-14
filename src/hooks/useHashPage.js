import { useEffect, useState } from 'react'

export const PAGES = { DASHBOARD: 'dashboard', CALENDAR: 'kalender', PRINT: 'cetak' }

const readHash = () => {
  if (window.location.hash === '#/kalender') return PAGES.CALENDAR
  if (window.location.hash === '#/cetak') return PAGES.PRINT
  return PAGES.DASHBOARD
}

// Navigasi halaman berbasis hash URL (#/, #/kalender, #/cetak)
export function useHashPage() {
  const [page, setPage] = useState(readHash)

  useEffect(() => {
    const onChange = () => setPage(readHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = (next) => {
    if (next === PAGES.CALENDAR) window.location.hash = '#/kalender'
    else if (next === PAGES.PRINT) window.location.hash = '#/cetak'
    else window.location.hash = '#/'
  }

  return [page, navigate]
}
