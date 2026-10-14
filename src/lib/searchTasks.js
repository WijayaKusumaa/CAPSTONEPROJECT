import { findCourse } from '../data/courses'

// Samakan huruf besar/kecil dan hilangkan aksen agar pencarian lebih toleran
const normalize = (value) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

// Pecah query menjadi kata-kata unik (tanpa spasi berlebih)
export function getSearchTerms(query) {
  return [...new Set(normalize(query).split(/\s+/).filter(Boolean))]
}

// Teks yang dicari: judul, kode (utama + lama), dan nama mata kuliah
function haystackOf(task) {
  const course = findCourse(task.courseCode)
  return normalize([task.title, task.courseCode, course?.code, course?.altCode, course?.name].filter(Boolean).join(' '))
}

// Cari tugas: semua kata harus cocok (AND), urutan kata bebas, urutan tugas tidak berubah
export function searchTasks(tasks, query) {
  const terms = getSearchTerms(query)
  if (!terms.length) return tasks
  return tasks.filter((task) => {
    const haystack = haystackOf(task)
    return terms.every((term) => haystack.includes(term))
  })
}

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Pecah teks menjadi potongan { text, match } untuk menyorot kata yang cocok
export function splitByTerms(text, terms) {
  const source = String(text ?? '')
  if (!source || !terms.length) return [{ text: source, match: false }]

  const pattern = new RegExp(`(${[...terms].sort((a, b) => b.length - a.length).map(escapeRegExp).join('|')})`, 'gi')
  return source
    .split(pattern)
    .filter(Boolean)
    .map((part) => ({ text: part, match: terms.some((term) => part.toLowerCase() === term) }))
}
