import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'

const DEBOUNCE_MS = 150

// Kolom pencarian tugas; onChange dipanggil dengan jeda singkat saat mengetik
export default function SearchInput({ value, onChange }) {
  const [text, setText] = useState(value)
  const timer = useRef()

  // Sinkronkan jika nilai diubah dari luar (misal tombol "Hapus pencarian")
  useEffect(() => setText(value), [value])
  useEffect(() => () => clearTimeout(timer.current), [])

  const handleChange = (event) => {
    const next = event.target.value
    setText(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => onChange(next), DEBOUNCE_MS)
  }

  const clear = () => {
    clearTimeout(timer.current)
    setText('')
    onChange('')
  }

  return (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute" />
      <input
        id="search-tasks"
        type="search"
        aria-label="Cari tugas"
        placeholder="Cari tugas atau matkul…"
        autoComplete="off"
        className="input !py-2 pl-10 pr-9 [&::-webkit-search-cancel-button]:hidden"
        value={text}
        onChange={handleChange}
        onKeyDown={(event) => event.key === 'Escape' && text && clear()}
      />
      {text && (
        <button
          type="button"
          onClick={clear}
          aria-label="Hapus pencarian"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-mute transition hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
