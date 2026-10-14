import { useEffect, useState } from 'react'
import { getPermission } from '../lib/browserNotify'

// Hook status izin notifikasi browser; ikut berubah jika izin dicabut/diberikan saat aplikasi berjalan
export function useNotificationPermission() {
  const [permission, setPermission] = useState(() => getPermission())

  useEffect(() => {
    const sync = () => setPermission(getPermission())
    let status
    navigator.permissions
      ?.query({ name: 'notifications' })
      .then((result) => {
        status = result
        status.addEventListener('change', sync)
      })
      .catch(() => {})

    document.addEventListener('visibilitychange', sync)
    window.addEventListener('focus', sync)
    return () => {
      status?.removeEventListener('change', sync)
      document.removeEventListener('visibilitychange', sync)
      window.removeEventListener('focus', sync)
    }
  }, [])

  return [permission, setPermission]
}
