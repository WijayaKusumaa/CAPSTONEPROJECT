// Pembungkus Notification API browser. Semua akses ke window lewat `env` supaya aman dites.
// Catatan: ini notifikasi lokal; hanya muncul selama TugasKu terbuka di browser (bukan Web Push server).

const defaultEnv = () => (typeof window === 'undefined' ? undefined : window)

export function isSupported(env = defaultEnv()) {
  return Boolean(env) && 'Notification' in env && typeof env.Notification === 'function'
}

// Mengembalikan 'granted' | 'denied' | 'default' | 'unsupported'
export function getPermission(env = defaultEnv()) {
  return isSupported(env) ? env.Notification.permission : 'unsupported'
}

// Harus dipanggil dari klik pengguna, bukan otomatis saat halaman dimuat
export async function requestPermission(env = defaultEnv()) {
  if (!isSupported(env)) return 'unsupported'
  try {
    const result = await env.Notification.requestPermission()
    return result ?? env.Notification.permission
  } catch {
    return env.Notification.permission
  }
}

// `tag` dipakai browser sebagai kunci dedup: notifikasi bertag sama saling menggantikan
export function showTaskNotification({ title, body, tag }, env = defaultEnv()) {
  if (getPermission(env) !== 'granted') return false
  try {
    const notification = new env.Notification(title, { body, tag })
    notification.onclick = () => {
      env.focus?.()
      notification.close?.()
    }
    return true
  } catch {
    // Beberapa browser (mis. Chrome Android) melempar error pada konstruktor Notification
    return false
  }
}
