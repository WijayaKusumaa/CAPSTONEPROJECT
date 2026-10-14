import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Pengaturan aplikasi (tersimpan di localStorage)
export const useSettingsStore = create()(
  persist(
    (set) => ({
      browserNotifications: false,
      setBrowserNotifications: (value) => set({ browserNotifications: Boolean(value) }),

      activeSemester: null,
      setActiveSemester: (value) => {
        const num = Number(value)
        const valid = Number.isInteger(num) && num >= 1 && num <= 8 ? num : null
        set({ activeSemester: valid })
      },
    }),
    { name: 'tugasku:settings', version: 1 },
  ),
)
