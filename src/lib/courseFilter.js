import { findCourse } from '../data/courses'

export const ALL = 'all'
export const OTHER_GROUP = 'lainnya'

const groupOf = (code) => findCourse(code)?.semester ?? OTHER_GROUP
const canonicalCode = (code) => findCourse(code)?.code ?? String(code ?? '').trim().toUpperCase()

const groupLabel = (key) => {
  if (key === OTHER_GROUP) return 'Lainnya'
  return Number.isNaN(Number(key)) ? `Mata Kuliah ${key}` : `Semester ${key}`
}

const groupOrder = (key) => {
  if (key === OTHER_GROUP) return Infinity
  const n = Number(key)
  return Number.isNaN(n) ? 100 : n
}

// Kelompokkan mata kuliah yang benar-benar punya tugas, per semester
export function buildCourseGroups(tasks) {
  const groups = new Map()
  for (const task of tasks) {
    const key = groupOf(task.courseCode)
    const code = canonicalCode(task.courseCode)
    if (!groups.has(key)) groups.set(key, { key, label: groupLabel(key), count: 0, courses: new Map() })
    const group = groups.get(key)
    group.count += 1
    const course = group.courses.get(code) ?? { code, name: findCourse(code)?.name ?? '', count: 0 }
    course.count += 1
    group.courses.set(code, course)
  }
  return [...groups.values()]
    .sort((a, b) => groupOrder(a.key) - groupOrder(b.key))
    .map((g) => ({ ...g, courses: [...g.courses.values()].sort((a, b) => a.code.localeCompare(b.code)) }))
}

// Pilihan filter yang sudah tidak valid (misal tugas dihapus) dikembalikan ke "semua"
export function sanitizeCourseFilter({ group, course }, groups) {
  const g = groups.find((item) => item.key === group)
  if (!g) return { group: ALL, course: ALL }
  if (course !== ALL && !g.courses.some((c) => c.code === course)) return { group, course: ALL }
  return { group, course }
}

export function filterByCourse(tasks, { group, course }) {
  return tasks.filter((task) => {
    if (group !== ALL && String(groupOf(task.courseCode)) !== String(group)) return false
    if (course !== ALL && canonicalCode(task.courseCode) !== course) return false
    return true
  })
}
