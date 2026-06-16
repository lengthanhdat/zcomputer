import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './useCartStore';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
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
      updateUser: (data) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...data } });
        }
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'auth-storage', // Tên key trong localStorage
    }
  )
);
