import { create } from 'zustand'

let counter = 0

// Store notifikasi toast
export const useToastStore = create((set) => ({
  toasts: [],

  push: ({ title, message, variant = 'neutral', duration = 8000 }) => {
    counter += 1
    const toast = { id: counter, title, message, variant, duration }
    set((s) => ({ toasts: [...s.toasts, toast].slice(-5) }))
    return toast.id
  },

  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// Helper fungsi untuk memunculkan toast
export const toast = {
  show: (options) => useToastStore.getState().push(options),
  success: (title, message) => useToastStore.getState().push({ title, message, variant: 'success', duration: 4000 }),
  error: (title, message) => useToastStore.getState().push({ title, message, variant: 'danger', duration: 6000 }),
}
