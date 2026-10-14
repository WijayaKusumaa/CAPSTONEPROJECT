import { describe, expect, it } from 'vitest'
import { COURSES } from '../data/courses'
import { orderCourseGroups } from './courseOptions'

describe('courseOptions.js', () => {
  it('tanpa semester aktif: urut dari Semester 1 sampai 8, Kesetaraan terakhir', () => {
    const groups = orderCourseGroups(COURSES, null)
    const labels = groups.map((g) => g.label)

    expect(labels[0]).toBe('Semester 1')
    expect(labels[1]).toBe('Semester 2')
    expect(labels[7]).toBe('Semester 8')
    expect(labels[8]).toBe('Mata Kuliah Kesetaraan')
  })

  it('dengan semester aktif (misal: 4): Semester 4 (Aktif) diletakkan paling atas', () => {
    const groups = orderCourseGroups(COURSES, 4)
    const labels = groups.map((g) => g.label)

    expect(labels[0]).toBe('Semester 4 (Aktif)')
    expect(labels[1]).toBe('Semester 1')
    expect(labels[2]).toBe('Semester 2')
    expect(labels[3]).toBe('Semester 3')
    expect(labels[4]).toBe('Semester 5')
    expect(labels[5]).toBe('Semester 6')
    expect(labels[6]).toBe('Semester 7')
    expect(labels[7]).toBe('Semester 8')
    expect(labels[8]).toBe('Mata Kuliah Kesetaraan')
  })

  it('dengan semester aktif 8: Semester 8 (Aktif) di atas, Kesetaraan tetap di akhir', () => {
    const groups = orderCourseGroups(COURSES, '8')
    const labels = groups.map((g) => g.label)

    expect(labels[0]).toBe('Semester 8 (Aktif)')
    expect(labels[8]).toBe('Mata Kuliah Kesetaraan')
  })

  it('tidak menghilangkan mata kuliah apa pun (total item tetap persis sama)', () => {
    const defaultGroups = orderCourseGroups(COURSES, null)
    const activeGroups = orderCourseGroups(COURSES, 3)

    const countCourses = (arr) => arr.reduce((acc, g) => acc + g.courses.length, 0)

    expect(countCourses(defaultGroups)).toBe(COURSES.length)
    expect(countCourses(activeGroups)).toBe(COURSES.length)
  })

  it('mengabaikan nilai semester aktif yang tidak valid (di luar 1-8)', () => {
    const groups = orderCourseGroups(COURSES, 99)
    expect(groups[0].label).toBe('Semester 1')

    const groups2 = orderCourseGroups(COURSES, 'invalid')
    expect(groups2[0].label).toBe('Semester 1')
  })
})
