import { afterEach, describe, expect, it, vi } from 'vitest'
import { getPermission, isSupported, requestPermission, showTaskNotification } from './browserNotify'

// Membuat window palsu dengan Notification palsu
function makeEnv(permission = 'default', requestResult = 'granted') {
  const created = []
  class FakeNotification {
    constructor(title, options) {
      this.title = title
      this.options = options
      this.close = vi.fn()
      created.push(this)
    }
  }
  FakeNotification.permission = permission
  FakeNotification.requestPermission = vi.fn(async () => {
    FakeNotification.permission = requestResult
    return requestResult
  })
  return { Notification: FakeNotification, focus: vi.fn(), created }
}

afterEach(() => vi.restoreAllMocks())

describe('isSupported / getPermission', () => {
  it('mendeteksi browser yang mendukung Notification', () => {
    expect(isSupported(makeEnv())).toBe(true)
    expect(getPermission(makeEnv('granted'))).toBe('granted')
    expect(getPermission(makeEnv('denied'))).toBe('denied')
  })

  it('melaporkan unsupported jika Notification tidak ada atau env kosong', () => {
    expect(isSupported({})).toBe(false)
    expect(getPermission({})).toBe('unsupported')
    expect(isSupported(undefined)).toBe(false)
  })
})

describe('requestPermission', () => {
  it('meminta izin dan mengembalikan hasilnya', async () => {
    const env = makeEnv('default', 'granted')
    await expect(requestPermission(env)).resolves.toBe('granted')
    expect(env.Notification.requestPermission).toHaveBeenCalledOnce()
  })

  it('mengembalikan denied jika pengguna menolak', async () => {
    await expect(requestPermission(makeEnv('default', 'denied'))).resolves.toBe('denied')
  })

  it('mengembalikan unsupported jika tidak didukung', async () => {
    await expect(requestPermission({})).resolves.toBe('unsupported')
  })
})

describe('showTaskNotification', () => {
  it('membuat notifikasi dengan title, body, dan tag sebagai kunci dedup', () => {
    const env = makeEnv('granted')
    const ok = showTaskNotification({ title: 'Deadline besok', body: 'STSI4105 · Laporan', tag: 'k1' }, env)
    expect(ok).toBe(true)
    expect(env.created).toHaveLength(1)
    expect(env.created[0].title).toBe('Deadline besok')
    expect(env.created[0].options).toEqual({ body: 'STSI4105 · Laporan', tag: 'k1' })
  })

  it('memakai tag yang sama untuk pengiriman ulang sehingga browser dapat menggantikannya', () => {
    const env = makeEnv('granted')
    showTaskNotification({ title: 'A', body: 'x', tag: 'same' }, env)
    showTaskNotification({ title: 'A', body: 'x', tag: 'same' }, env)
    expect(env.created.map((n) => n.options.tag)).toEqual(['same', 'same'])
  })

  it('klik notifikasi memfokuskan jendela dan menutup notifikasi', () => {
    const env = makeEnv('granted')
    showTaskNotification({ title: 'A', body: 'x', tag: 't' }, env)
    env.created[0].onclick()
    expect(env.focus).toHaveBeenCalled()
    expect(env.created[0].close).toHaveBeenCalled()
  })

  it('tidak mengirim saat izin ditolak, belum diminta, atau tidak didukung', () => {
    const denied = makeEnv('denied')
    const fresh = makeEnv('default')
    expect(showTaskNotification({ title: 'A', body: 'x', tag: 't' }, denied)).toBe(false)
    expect(showTaskNotification({ title: 'A', body: 'x', tag: 't' }, fresh)).toBe(false)
    expect(showTaskNotification({ title: 'A', body: 'x', tag: 't' }, {})).toBe(false)
    expect(denied.created).toHaveLength(0)
    expect(fresh.created).toHaveLength(0)
  })

  it('izin dicabut saat berjalan: pengiriman berikutnya dihentikan', () => {
    const env = makeEnv('granted')
    expect(showTaskNotification({ title: 'A', body: 'x', tag: '1' }, env)).toBe(true)
    env.Notification.permission = 'denied'
    expect(showTaskNotification({ title: 'B', body: 'y', tag: '2' }, env)).toBe(false)
    expect(env.created).toHaveLength(1)
  })

  it('mengembalikan false jika konstruktor Notification melempar error', () => {
    const env = makeEnv('granted')
    env.Notification = Object.assign(
      function Broken() {
        throw new TypeError('Illegal constructor')
      },
      { permission: 'granted' },
    )
    expect(showTaskNotification({ title: 'A', body: 'x', tag: 't' }, env)).toBe(false)
  })
})
