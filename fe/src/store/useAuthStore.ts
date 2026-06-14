import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => {
        set({ user, token });
        useCartStore.getState().setActiveUser(user._id);
      },
      logout: () => {
        set({ user: null, token: null });
        useCartStore.getState().setActiveUser('guest');
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
    }
  )
);
