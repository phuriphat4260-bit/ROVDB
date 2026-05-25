import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  rank: string;
  token?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (data: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (data) => {
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    set({ user: data, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      try {
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          set({ user: res.data.data, isAuthenticated: true });
        }
      } catch (err) {
        localStorage.removeItem('token');
        set({ user: null, isAuthenticated: false });
      }
    }
  }
}));
