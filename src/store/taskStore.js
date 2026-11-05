import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSubtaskId, MAX_SUBTASKS, migrateStoreV2ToV3, syncStatusWithSubtasks } from '../lib/subtasks'
import { normalizeTaskInput } from '../lib/validation'

const createId = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`

const buildTask = (input) => {
  const now = new Date().toISOString()
  return {
    ...normalizeTaskInput(input),
    id: createId(),
    createdAt: now,
    updatedAt: now,
  }
}

// Store data tugas dan riwayat notifikasi (tersimpan di localStorage)
export const useTaskStore = create()(
  persist(
    (set) => ({
      tasks: [],
      notified: {},

      addTask: (input) => set((s) => ({ tasks: [...s.tasks, buildTask(input)] })),

      addTasks: (inputs) => set((s) => ({ tasks: [...s.tasks, ...inputs.map(buildTask)] })),

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...syncStatusWithSubtasks({ ...t, ...normalizeTaskInput({ ...t, ...patch }) }),
                  updatedAt: new Date().toISOString(),
                }
              : t,
          ),
        })),

      setStatus: (id, status) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)),
        })),

      removeTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      clearTasks: () => set({ tasks: [], notified: {} }),

      // Catat kunci pengingat beserta waktu notifikasi ditampilkan (sesuai Bab 3.3.3 Tugas 2)
      markNotified: (keys, timestamp = new Date().toISOString()) =>
        set((s) => ({
          notified: keys.reduce((acc, key) => ({ ...acc, [key]: timestamp }), s.notified),
        })),

      // Aksi manipulasi subtugas
      addSubtask: (taskId, title) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t
            const cleanTitle = String(title ?? '').trim().slice(0, 80)
            if (!cleanTitle) return t
            const currentSubtasks = Array.isArray(t.subtasks) ? t.subtasks : []
            if (currentSubtasks.length >= MAX_SUBTASKS) return t

            const updated = {
              ...t,
              subtasks: [...currentSubtasks, { id: createSubtaskId(), title: cleanTitle, done: false }],
              updatedAt: new Date().toISOString(),
            }
            return syncStatusWithSubtasks(updated)
          }),
        })),

      toggleSubtask: (taskId, subId) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t
            const currentSubtasks = Array.isArray(t.subtasks) ? t.subtasks : []
            const updated = {
              ...t,
              subtasks: currentSubtasks.map((st) => (st.id === subId ? { ...st, done: !st.done } : st)),
              updatedAt: new Date().toISOString(),
            }
            return syncStatusWithSubtasks(updated)
          }),
        })),

      removeSubtask: (taskId, subId) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t
            const currentSubtasks = Array.isArray(t.subtasks) ? t.subtasks : []
            const updated = {
              ...t,
              subtasks: currentSubtasks.filter((st) => st.id !== subId),
              updatedAt: new Date().toISOString(),
            }
            return syncStatusWithSubtasks(updated)
          }),
        })),

      renameSubtask: (taskId, subId, newTitle) =>
        set((s) => ({
          tasks: s.tasks.map((t) => {
            if (t.id !== taskId) return t
            const cleanTitle = String(newTitle ?? '').trim().slice(0, 80)
            if (!cleanTitle) return t
            const currentSubtasks = Array.isArray(t.subtasks) ? t.subtasks : []
            const updated = {
              ...t,
              subtasks: currentSubtasks.map((st) => (st.id === subId ? { ...st, title: cleanTitle } : st)),
              updatedAt: new Date().toISOString(),
            }
            return syncStatusWithSubtasks(updated)
          }),
        })),
    }),
    {
      name: 'tugasku:v1',
      version: 3,
      // v3: migrasi v2 + inisialisasi subtasks: [] untuk setiap tugas lama
      migrate: migrateStoreV2ToV3,
    },
  ),
)
