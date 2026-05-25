'use client';

import { useEffect, useState } from 'react';
import { useHeroStore } from '@/store/useHeroStore';
import HeroCard from '@/components/HeroCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function MetaPage() {
  const { heroes, isLoading, fetchHeroes } = useHeroStore();
  const [activeTier, setActiveTier] = useState<string>('All');

  useEffect(() => {
    fetchHeroes();
  }, [fetchHeroes]);


  const metaHeroes = heroes.filter(hero => hero.metaTier);
  const tiers = ['All', 'SS Tier', 'A Tier'];

  const filteredHeroes = metaHeroes.filter(hero => {
    if (activeTier === 'All') return true;
    return hero.metaTier === activeTier;
  });

  // Group heroes by tier for display when 'All' is selected, or just show the filtered ones
  const groupedHeroes = filteredHeroes.reduce((acc, hero) => {
    const tier = hero.metaTier || 'Other';
    if (!acc[tier]) acc[tier] = [];
    acc[tier].push(hero);
    return acc;
  }, {} as Record<string, typeof heroes>);

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-12 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-['Bebas_Neue'] text-primary tracking-widest mb-4">
          META TIER LIST 2026
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-center mb-8 font-['Kanit']">
          รวมตัวละคร ROV สุดโหดประจำตำแหน่ง เล่นง่าย ได้คิล แนะนำโดยมือโปร (อัปเดตล่าสุด)
        </p>

        {/* Tier Filters */}
        <div className="flex flex-wrap justify-center gap-4">
          {tiers.map(tier => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`px-8 py-3 font-['Bebas_Neue'] text-xl tracking-widest uppercase transition-all border-2 ${
                activeTier === tier
                  ? 'bg-primary text-black border-primary shadow-[0_0_15px_rgba(251,211,102,0.4)]'
                  : 'bg-black/50 text-white border-white/20 hover:border-primary/50'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedHeroes)
            .sort((a, b) => (a[0] === 'SS Tier' ? -1 : 1)) // Sort SS Tier first
            .map(([tier, tierHeroes]) => (
            <div key={tier} className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-3xl font-['Bebas_Neue'] text-white tracking-widest uppercase">{tier}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent"></div>
              </div>
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
              >
                <AnimatePresence>
                  {tierHeroes.map(hero => (
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
            </div>
          ))}
          {metaHeroes.length === 0 && !isLoading && (
            <div className="text-center text-on-surface-variant font-['Kanit'] py-12">
              ไม่พบข้อมูลฮีโร่เมต้าในขณะนี้
            </div>
          )}
        </div>
      )}
    </div>
  );
}
