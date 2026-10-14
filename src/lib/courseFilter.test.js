import { describe, expect, it } from 'vitest'
import { ALL, buildCourseGroups, filterByCourse, sanitizeCourseFilter } from './courseFilter'

const tasks = [
  { id: 1, courseCode: 'STSI4105' },
  { id: 2, courseCode: 'STSI4105' },
  { id: 3, courseCode: 'MSIM4206' }, // kode lama Basis Data
  { id: 4, courseCode: 'STSI4209' },
  { id: 5, courseCode: 'MKWU4108' }, // kesetaraan
  { id: 6, courseCode: 'IF9999' }, // tidak dikenal
]

describe('buildCourseGroups', () => {
  const groups = buildCourseGroups(tasks)

  it('mengurutkan semester naik, kesetaraan, lalu lainnya', () => {
    expect(groups.map((g) => g.label)).toEqual(['Semester 2', 'Semester 4', 'Mata Kuliah Kesetaraan', 'Lainnya'])
  })

  it('menyatukan kode lama dengan kode utama dan menghitung tugas', () => {
    const sem2 = groups.find((g) => g.key === '2')
    expect(sem2.count).toBe(3)
    expect(sem2.courses).toEqual([{ code: 'STSI4105', name: 'Basis Data', count: 3 }])
  })

  it('hanya memuat matkul yang punya tugas', () => {
    expect(buildCourseGroups([])).toEqual([])
  })
})

describe('filterByCourse', () => {
  it('tanpa filter mengembalikan semua tugas', () => {
    expect(filterByCourse(tasks, { group: ALL, course: ALL })).toHaveLength(6)
  })

  it('memfilter per semester', () => {
    expect(filterByCourse(tasks, { group: '2', course: ALL }).map((t) => t.id)).toEqual([1, 2, 3])
  })

  it('memfilter per matkul termasuk kode lama', () => {
    expect(filterByCourse(tasks, { group: ALL, course: 'STSI4105' }).map((t) => t.id)).toEqual([1, 2, 3])
  })

  it('memfilter kode tidak dikenal lewat grup lainnya', () => {
    expect(filterByCourse(tasks, { group: 'lainnya', course: ALL }).map((t) => t.id)).toEqual([6])
  })
})

describe('sanitizeCourseFilter', () => {
  const groups = buildCourseGroups(tasks)

  it('mempertahankan pilihan yang valid', () => {
    expect(sanitizeCourseFilter({ group: '2', course: 'STSI4105' }, groups)).toEqual({ group: '2', course: 'STSI4105' })
  })

  it('mereset matkul yang tidak ada di semester terpilih', () => {
    expect(sanitizeCourseFilter({ group: '4', course: 'STSI4105' }, groups)).toEqual({ group: '4', course: ALL })
  })

  it('mereset semua jika grup sudah tidak ada', () => {
    expect(sanitizeCourseFilter({ group: '7', course: ALL }, groups)).toEqual({ group: ALL, course: ALL })
  })
})
