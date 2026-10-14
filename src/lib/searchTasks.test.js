import { describe, expect, it } from 'vitest'
import { getSearchTerms, searchTasks, splitByTerms } from './searchTasks'

const tasks = [
  { id: 1, courseCode: 'STSI4105', title: 'Laporan Praktikum Basis Data' },
  { id: 2, courseCode: 'MSIM4206', title: 'Kuis Query SQL' }, // kode lama Basis Data
  { id: 3, courseCode: 'STSI4209', title: 'Proyek Akhir (Web) [v2]' },
  { id: 4, courseCode: 'IF9999', title: 'Tugas Misterius' }, // kode tidak dikenal
]

const ids = (result) => result.map((t) => t.id)

describe('searchTasks', () => {
  it('mencari berdasarkan judul tanpa peduli huruf besar/kecil', () => {
    expect(ids(searchTasks(tasks, 'LAPORAN praktikum'))).toEqual([1])
  })

  it('mencari berdasarkan kode utama', () => {
    expect(ids(searchTasks(tasks, 'stsi4209'))).toEqual([3])
  })

  it('kode lama menemukan tugas berkode utama dan sebaliknya', () => {
    expect(ids(searchTasks(tasks, 'MSIM4206'))).toEqual([1, 2])
    expect(ids(searchTasks(tasks, 'STSI4105'))).toEqual([1, 2])
  })

  it('mencari berdasarkan nama mata kuliah', () => {
    expect(ids(searchTasks(tasks, 'pemrograman berbasis web'))).toEqual([3])
  })

  it('semua kata harus cocok (AND) dengan urutan bebas', () => {
    expect(ids(searchTasks(tasks, 'data basis'))).toEqual([1, 2])
    expect(ids(searchTasks(tasks, 'basis sql'))).toEqual([2])
    expect(searchTasks(tasks, 'sql web')).toEqual([])
  })

  it('query kosong atau spasi saja mengembalikan semua tugas dengan urutan sama', () => {
    expect(searchTasks(tasks, '')).toBe(tasks)
    expect(searchTasks(tasks, '   ')).toBe(tasks)
    expect(searchTasks(tasks, undefined)).toBe(tasks)
  })

  it('karakter regex diperlakukan sebagai teks biasa', () => {
    expect(ids(searchTasks(tasks, '(web)'))).toEqual([3])
    expect(ids(searchTasks(tasks, '[v2]'))).toEqual([3])
    expect(searchTasks(tasks, '.*')).toEqual([])
    expect(() => searchTasks(tasks, '((')).not.toThrow()
  })

  it('menemukan tugas berkode tidak dikenal lewat judul atau kode', () => {
    expect(ids(searchTasks(tasks, 'misterius'))).toEqual([4])
    expect(ids(searchTasks(tasks, 'if9999'))).toEqual([4])
  })

  it('mengembalikan array kosong jika tidak ada yang cocok', () => {
    expect(searchTasks(tasks, 'xyz-tidak-ada')).toEqual([])
  })
})

describe('getSearchTerms', () => {
  it('memecah per kata, membuang duplikat dan spasi berlebih', () => {
    expect(getSearchTerms('  Basis   DATA basis ')).toEqual(['basis', 'data'])
  })
})

describe('splitByTerms', () => {
  it('menandai bagian yang cocok tanpa peduli huruf besar/kecil', () => {
    expect(splitByTerms('Laporan Basis Data', ['basis'])).toEqual([
      { text: 'Laporan ', match: false },
      { text: 'Basis', match: true },
      { text: ' Data', match: false },
    ])
  })

  it('aman untuk karakter regex', () => {
    expect(splitByTerms('Proyek (Web)', ['(web)'])).toEqual([
      { text: 'Proyek ', match: false },
      { text: '(Web)', match: true },
    ])
  })

  it('tanpa kata kembali sebagai satu potongan', () => {
    expect(splitByTerms('Teks', [])).toEqual([{ text: 'Teks', match: false }])
  })
})
