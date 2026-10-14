/** Unduh teks sebagai file di browser tanpa server. */
export function downloadTextFile(filename, content, mime = 'text/csv;charset=utf-8') {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const url = URL.createObjectURL(new Blob([content], { type: mime }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 100)
}
