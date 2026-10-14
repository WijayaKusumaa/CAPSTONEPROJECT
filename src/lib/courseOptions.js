// Mengelompokkan dan mengurutkan opsi mata kuliah untuk dropdown form
// Jika activeSemester dipilih, kelompok semester tersebut diutamakan paling atas
export function orderCourseGroups(courses = [], activeSemester = null) {
  const targetSemester =
    Number.isInteger(Number(activeSemester)) && Number(activeSemester) >= 1 && Number(activeSemester) <= 8
      ? Number(activeSemester)
      : null

  // Kumpulkan mata kuliah per grup semester
  const groupMap = new Map()

  for (const c of courses) {
    const semKey = String(c.semester)
    if (!groupMap.has(semKey)) {
      groupMap.set(semKey, {
        key: semKey,
        label: c.groupLabel ?? (Number.isNaN(Number(semKey)) ? `Mata Kuliah ${semKey}` : `Semester ${semKey}`),
        courses: [],
      })
    }
    groupMap.get(semKey).courses.push(c)
  }

  const allGroups = [...groupMap.values()]

  // Pisahkan grup semester angka (1..8) dan grup non-angka (seperti Kesetaraan)
  const numericGroups = allGroups.filter((g) => !Number.isNaN(Number(g.key)))
  const otherGroups = allGroups.filter((g) => Number.isNaN(Number(g.key)))

  // Urutkan grup angka
  numericGroups.sort((a, b) => Number(a.key) - Number(b.key))

  if (targetSemester !== null) {
    const activeIndex = numericGroups.findIndex((g) => Number(g.key) === targetSemester)
    if (activeIndex !== -1) {
      const [activeGroup] = numericGroups.splice(activeIndex, 1)
      const enhancedActiveGroup = {
        ...activeGroup,
        label: `${activeGroup.label} (Aktif)`,
      }
      return [enhancedActiveGroup, ...numericGroups, ...otherGroups]
    }
  }

  return [...numericGroups, ...otherGroups]
}
