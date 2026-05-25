'use client';

import { useEffect } from 'react';
import { useHeroStore } from '@/store/useHeroStore';
import HeroCard from '@/components/HeroCard';
import { motion, AnimatePresence } from 'framer-motion';

const ROLES = [
  { id: 'All', label: 'ALL HEROES', icon: '' },
  { id: 'Assassin', label: 'ASSASSIN', icon: 'swords' },
  { id: 'Mage', label: 'MAGE', icon: 'auto_awesome' },
  { id: 'Fighter', label: 'FIGHTER', icon: 'sports_martial_arts' },
  { id: 'Carry', label: 'CARRY', icon: 'my_location' },
  { id: 'Tank', label: 'TANK', icon: 'shield' },
  { id: 'Support', label: 'SUPPORT', icon: 'healing' }
];

export default function Home() {
  const { heroes, isLoading, error, fetchHeroes, searchQuery, setSearchQuery, activeRole, setActiveRole } = useHeroStore();

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);

  const filteredHeroes = heroes.filter((hero) => {
    const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = activeRole === 'All' || hero.classes.includes(activeRole);
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      {/* Header & Search */}
      <div className="mb-12 flex flex-col items-center">
        <div className="relative w-full max-w-2xl bg-white flex items-center p-2">
          <div className="flex-1 bg-white">
            <button 
              onClick={() => setActiveRole('All')}
              className={`w-48 h-12 flex items-center justify-center border-2 border-black font-['Bebas_Neue'] text-xl tracking-widest ${activeRole === 'All' ? 'bg-primary text-black' : 'bg-white text-black'}`}
            >
              ALL HEROES
            </button>
          </div>
          <input 
            type="text" 
            placeholder="ค้นหา..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 bg-white border-b-2 border-primary/50 py-2 px-4 text-black focus:outline-none focus:border-primary transition-all font-medium" 
          />
          <span className="material-symbols-outlined text-primary ml-2">search</span>
        </div>

        {/* Role Filters */}
        <div className="grid grid-cols-3 gap-4 mt-8 w-full max-w-4xl">
          {ROLES.filter(r => r.id !== 'All').map(role => (
            <button 
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`flex items-center justify-center gap-2 h-14 border border-white/20 transition-all font-['Bebas_Neue'] text-xl tracking-widest uppercase ${
                activeRole === role.id 
                  ? 'bg-primary text-black border-primary' 
                  : 'bg-black/50 text-white hover:border-primary/50'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{role.icon}</span>
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
        >
          <AnimatePresence>
            {filteredHeroes.map(hero => (
              <motion.div
                key={hero.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <HeroCard hero={hero} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-10 text-warrior-red">
          <p className="text-xl font-bold">Error: {error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredHeroes.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4 block">search_off</span>
          <p className="text-xl text-on-surface">No heroes found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
