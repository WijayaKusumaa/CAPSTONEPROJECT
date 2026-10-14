import { useEffect, useState } from 'react'
import { toISODate } from '../lib/dates'

// Hook untuk mendapatkan tanggal hari ini (YYYY-MM-DD)
export function useToday() {
  const [today, setToday] = useState(() => toISODate())

  useEffect(() => {
    const sync = () => setToday(toISODate())
    const timer = setInterval(sync, 60_000)
    document.addEventListener('visibilitychange', sync)
    window.addEventListener('focus', sync)
    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  return today
}
