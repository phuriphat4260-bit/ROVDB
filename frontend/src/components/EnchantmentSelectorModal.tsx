import React from 'react';
import { motion } from 'framer-motion';

export default function EnchantmentSelectorModal({ onClose, onSelect, enchantmentData, allowedType }: { onClose: () => void, onSelect: (iconPath: string) => void, enchantmentData: Record<string, any>, allowedType?: string }) {
      const enchantIcons: Record<string, string> = {
    "sacred bead": "https://static.wikia.nocookie.net/arena-of-valor/images/8/87/Sacred_Bead.png/revision/latest?cb=20221012091847&path-prefix=th",
    "holy verdict": "https://static.wikia.nocookie.net/arena-of-valor/images/2/20/Holy_Verdict.png/revision/latest?cb=20221012092240&path-prefix=th",
    "sacred protection": "https://static.wikia.nocookie.net/arena-of-valor/images/2/27/Sacred_Protection.png/revision/latest?cb=20221012092331&path-prefix=th",
    "river treader": "https://static.wikia.nocookie.net/arena-of-valor/images/3/33/River_Treader.png/revision/latest?cb=20221012092948&path-prefix=th",
    "mark of frost": "https://static.wikia.nocookie.net/arena-of-valor/images/d/d3/Mark_of_Frost.png/revision/latest?cb=20221012093325&path-prefix=th",
    "regrowth": "https://static.wikia.nocookie.net/arena-of-valor/images/4/47/Regrowth.png/revision/latest?cb=20221012093038&path-prefix=th",
    "nature_s rage": "https://static.wikia.nocookie.net/arena-of-valor/images/3/3d/Nature%27s_Rage.png/revision/latest?cb=20221012093151&path-prefix=th",
    "arcane whisper": "https://static.wikia.nocookie.net/arena-of-valor/images/c/ca/Arcane_Whisper.png/revision/latest?cb=20221012093224&path-prefix=th",
    "shadow blade": "https://static.wikia.nocookie.net/arena-of-valor/images/4/4a/Shadow_Blade.png/revision/latest?cb=20221012092543&path-prefix=th",
    "deadly claw": "https://static.wikia.nocookie.net/arena-of-valor/images/8/89/Deadly_Claw.png/revision/latest?cb=20221012092717&path-prefix=th",
    "curse of death": "https://static.wikia.nocookie.net/arena-of-valor/images/c/cc/Curse_of_Death_%28%E0%B8%9E%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B9%81%E0%B8%9D%E0%B8%87%29.png/revision/latest?cb=20221012092817&path-prefix=th",
    "axe of sacrifice": "https://static.wikia.nocookie.net/arena-of-valor/images/b/b4/Axe_of_Sacrifice.png/revision/latest?cb=20221012092002&path-prefix=th",
    "desperate duel": "https://static.wikia.nocookie.net/arena-of-valor/images/8/8f/Desperate_Duel.png/revision/latest?cb=20221012092839&path-prefix=th",
    "gunslinger": "https://static.wikia.nocookie.net/arena-of-valor/images/c/c2/Gunslinger.png/revision/latest?cb=20221012093344&path-prefix=th",
    "reging inferno": "https://static.wikia.nocookie.net/arena-of-valor/images/1/11/Raging_Inferno.png/revision/latest?cb=20221012092526&path-prefix=th",
    "holy thunder": "https://static.wikia.nocookie.net/arena-of-valor/images/4/45/Holy_Thunder.png/revision/latest?cb=20221012092353&path-prefix=th",
    "reaper_s blessing": "https://static.wikia.nocookie.net/arena-of-valor/images/5/5d/Reaper%27s_Blessing.png/revision/latest?cb=20221012093247&path-prefix=th",
    "devourer": "https://static.wikia.nocookie.net/arena-of-valor/images/b/be/Devourer.png/revision/latest?cb=20221012092628&path-prefix=th",
    "minion kill": "https://static.wikia.nocookie.net/arena-of-valor/images/3/31/Minion_Kill.png/revision/latest?cb=20221012093425&path-prefix=th",
    "visceral boost": "https://static.wikia.nocookie.net/arena-of-valor/images/2/2c/Visceral_Boost.png/revision/latest?cb=20221012093446&path-prefix=th",
    "tower blessing": "https://static.wikia.nocookie.net/arena-of-valor/images/8/84/Tower_Blessing.png/revision/latest?cb=20221012092906&path-prefix=th",
    "nature_s gift": "https://static.wikia.nocookie.net/arena-of-valor/images/a/a5/Nature%27s_Gift.png/revision/latest?cb=20221012093007&path-prefix=th",
    "explosive shield": "https://static.wikia.nocookie.net/arena-of-valor/images/e/ec/Explosive_Shield.png/revision/latest?cb=20221012093128&path-prefix=th",
    "devil_s awakening": "https://static.wikia.nocookie.net/arena-of-valor/images/d/d6/Devil%27s_Awakening.png/revision/latest?cb=20221012092736&path-prefix=th",
    "blessing": "https://static.wikia.nocookie.net/arena-of-valor/images/c/cb/Blessing.png/revision/latest?cb=20221012092304&path-prefix=th",
    "bone cutter": "https://static.wikia.nocookie.net/arena-of-valor/images/2/26/Bone_Cutter.png/revision/latest?cb=20221012092659&path-prefix=th",
    "mana refill": "https://static.wikia.nocookie.net/arena-of-valor/images/4/46/Mana_Refill.png/revision/latest?cb=20221012091910&path-prefix=th",
    "forest wanderer": "https://static.wikia.nocookie.net/arena-of-valor/images/d/de/Forest_Wanderer.png/revision/latest?cb=20221012093106&path-prefix=th",
    "backstabbing": "https://static.wikia.nocookie.net/arena-of-valor/images/d/d7/Backstabbing.png/revision/latest?cb=20221012092929&path-prefix=th",
    "holy summoner": "https://static.wikia.nocookie.net/arena-of-valor/images/1/16/Holy_Summoner.png/revision/latest?cb=20221012092432&path-prefix=th",
    "endless cycle": "https://static.wikia.nocookie.net/arena-of-valor/images/e/e7/Endless_Cycle.png/revision/latest?cb=20221012093504&path-prefix=th"
  };

  const getIconPath = (id: string, name: string) => {
    return enchantIcons[name.toLowerCase()] || `https://cdn-webth.garenanow.com/webth/cdn/gth/rov/non-events/official/enchantment/${id}.png`;
  };

  const filteredEnchantments = Object.entries(enchantmentData).filter(([_, data]) => {
    if (allowedType && data.type !== allowedType) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1c1f2e] border border-[#FBD366]/30 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] flex flex-col relative overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-[#FBD366]">เลือกพลังแฝงใหม่</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
            {filteredEnchantments.map(([id, data], idx) => {
              const iconPath = getIconPath(id, data.name);
              const color = data.type === 'Lokheim' ? 'border-red-500' : data.type === 'Veda' ? 'border-yellow-500' : data.type === 'Afata' ? 'border-green-500' : 'border-blue-500';
              
              return (
                <div 
                  key={idx} 
                  onClick={() => onSelect(iconPath)}
                  className="flex flex-col items-center gap-3 cursor-pointer group bg-black/20 p-4 rounded-xl border border-white/5 hover:bg-white/5 transition-all"
                >
                  <div className={`w-16 h-16 rounded-full border-2 ${color} overflow-hidden group-hover:scale-110 transition-all bg-black/50`}>
                    <img src={iconPath.includes('?') ? iconPath + '&v=2' : iconPath + '?v=2'} alt={data.name} referrerPolicy="no-referrer" className="w-full h-full object-cover scale-125" onError={(e) => { (e.target as any).src = 'https://via.placeholder.com/64' }}/>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-white mb-1">{data.name}</div>
                    <div className="text-[10px] text-white/50 line-clamp-3 leading-relaxed">{data.desc}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
