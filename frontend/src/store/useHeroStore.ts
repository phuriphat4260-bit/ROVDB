import { create } from 'zustand';
import axios from 'axios';

interface Hero {
  id: number;
  slug: string;
  name: string;
  avatar: string;
  splashArt: string;
  classes: string[];
  survivability: number;
  attackDamage: number;
  skillEffect: number;
  difficulty: number;
  metaTier?: string;
}

interface HeroStore {
  heroes: Hero[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  activeRole: string;
  fetchHeroes: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setActiveRole: (role: string) => void;
}

export const useHeroStore = create<HeroStore>((set) => ({
  heroes: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  activeRole: 'All',

  fetchHeroes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('http://localhost:5000/api/heroes');
      if (response.data.success) {
        set({ heroes: response.data.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch heroes', isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setActiveRole: (role) => set({ activeRole: role }),
}));
