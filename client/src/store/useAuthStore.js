import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: ({ user, accessToken }) => set({ user, accessToken }),
      setAccessToken: (token) => set({ accessToken: token }),
      updateUser: (updates) =>
        set((state) => ({ user: state.user ? { ...state.user, ...updates } : state.user })),
      clearSession: () => set({ user: null, accessToken: null })
    }),
    {
      name: 'ecotrackify_auth'
    }
  )
);
