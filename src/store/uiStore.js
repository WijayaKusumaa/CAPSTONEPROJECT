import { create } from 'zustand'

// State pengelolaan modal dan dialog
export const useUiStore = create((set) => ({
  taskForm: null, // null = tertutup, { task: null | Task } = terbuka
  importOpen: false,
  deleteTarget: null,

  openTaskForm: (task = null) => set({ taskForm: { task } }),
  closeTaskForm: () => set({ taskForm: null }),

  openImport: () => set({ importOpen: true }),
  closeImport: () => set({ importOpen: false }),

  askDelete: (task) => set({ deleteTarget: task }),
  cancelDelete: () => set({ deleteTarget: null }),
}))
