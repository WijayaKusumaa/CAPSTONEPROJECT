import { describe, expect, it } from 'vitest'
import { collectDueReminders } from './reminders'
import { selectNotifiable } from './selectNotifiable'

const ctx = { enabled: true, permission: 'granted', visibility: 'hidden' }
const today = '2026-10-14'
const task = (id, deadline, status = 'belum') => ({ id, courseCode: 'STSI4105', title: `Tugas ${id}`, deadline, status })
const dueOf = (tasks, notified = {}) => collectDueReminders(tasks, today, notified)

describe('selectNotifiable', () => {
  it('mengirim notifikasi untuk pengingat saat tab tersembunyi', () => {
    const result = selectNotifiable(dueOf([task(1, '2026-10-15')]), ctx)
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('Deadline besok')
    expect(result[0].body).toContain('Tugas 1')
    expect(result[0].tag).toBe('1|2026-10-15|H-1')
  })

  it('tidak mengirim jika tab sedang terlihat (cukup toast)', () => {
    expect(selectNotifiable(dueOf([task(1, '2026-10-15')]), { ...ctx, visibility: 'visible' })).toEqual([])
  })

  it('tidak mengirim jika fitur nonaktif atau izin belum granted', () => {
    const due = dueOf([task(1, '2026-10-15')])
    expect(selectNotifiable(due, { ...ctx, enabled: false })).toEqual([])
    expect(selectNotifiable(due, { ...ctx, permission: 'denied' })).toEqual([])
    expect(selectNotifiable(due, { ...ctx, permission: 'default' })).toEqual([])
    expect(selectNotifiable(due, { ...ctx, permission: 'unsupported' })).toEqual([])
  })

  it('mengikuti aturan pengingat yang ada: selesai dan lewat deadline tidak pernah dinotifikasi', () => {
    const due = dueOf([task(1, '2026-10-15', 'selesai'), task(2, '2026-10-10'), task(3, '2026-10-13')])
    expect(selectNotifiable(due, ctx)).toEqual([])
  })

  it('tidak mengirim ulang pengingat yang sudah tercatat di notified (reload halaman)', () => {
    const first = dueOf([task(1, '2026-10-15')])
    const notified = { [first[0].key]: true }
    expect(selectNotifiable(dueOf([task(1, '2026-10-15')], notified), ctx)).toEqual([])
  })

  it('maksimum 3 notifikasi; sisanya digabung ringkasan "dan N tugas lainnya"', () => {
    const tasks = [1, 2, 3, 4, 5].map((id) => task(id, '2026-10-15'))
    const result = selectNotifiable(dueOf(tasks), ctx)
    expect(result).toHaveLength(3)
    expect(result[2].body).toBe('dan 3 tugas lainnya mendekati deadline.')
    expect(result[2].tag.startsWith('summary|')).toBe(true)
  })

  it('tepat 3 pengingat dikirim satu per satu tanpa ringkasan', () => {
    const tasks = [1, 2, 3].map((id) => task(id, '2026-10-15'))
    const result = selectNotifiable(dueOf(tasks), ctx)
    expect(result).toHaveLength(3)
    expect(result.every((n) => !n.tag.startsWith('summary|'))).toBe(true)
  })

  it('mengutamakan yang paling mendesak (hari H, lalu H-1) sebelum diringkas', () => {
    // id3 = hari H, id4 = H-1, id1 & id2 = H-3
    const tasks = [task(1, '2026-10-17'), task(2, '2026-10-16'), task(3, '2026-10-14'), task(4, '2026-10-15')]
    const result = selectNotifiable(dueOf(tasks), ctx)
    expect(result).toHaveLength(3)
    expect(result[0].tag).toBe('3|2026-10-14|H')
    expect(result[1].tag).toBe('4|2026-10-15|H-1')
    expect(result[2].body).toBe('dan 2 tugas lainnya mendekati deadline.')
  })

  it('daftar kosong menghasilkan array kosong', () => {
    expect(selectNotifiable([], ctx)).toEqual([])
  })
})
