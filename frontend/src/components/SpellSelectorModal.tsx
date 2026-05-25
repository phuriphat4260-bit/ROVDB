import React from 'react';
import { motion } from 'framer-motion';

export default function SpellSelectorModal({ onClose, onSelect, spellData }: { onClose: () => void, onSelect: (spellName: string, icon: string) => void, spellData: Record<string, any> }) {
  // Mock icons for spells since they are not stored in a DB with icons
      const spellIcons: Record<string, string> = {
    "Sprint": "https://static.wikia.nocookie.net/arena-of-valor/images/b/bb/Sprint.png/revision/latest?cb=20221012070307&path-prefix=th",
    "Execute": "https://static.wikia.nocookie.net/arena-of-valor/images/b/b6/Execute.png/revision/latest?cb=20221012070344&path-prefix=th",
    "Punish": "https://static.wikia.nocookie.net/arena-of-valor/images/7/7b/Punish.png/revision/latest?cb=20221012070356&path-prefix=th",
    "Frostbite": "https://static.wikia.nocookie.net/arena-of-valor/images/e/ee/Frostbite.png/revision/latest?cb=20221012070408&path-prefix=th",
    "Roar": "https://static.wikia.nocookie.net/arena-of-valor/images/a/ab/Roar.png/revision/latest?cb=20221012070420&path-prefix=th",
    "Heal": "https://static.wikia.nocookie.net/arena-of-valor/images/6/6e/Heal.png/revision/latest?cb=20221012070441&path-prefix=th",
    "Disturb": "https://static.wikia.nocookie.net/arena-of-valor/images/a/a6/Disturb.png/revision/latest?cb=20221012070454&path-prefix=th",
    "Dazed": "https://static.wikia.nocookie.net/arena-of-valor/images/a/ad/Dazed.png/revision/latest?cb=20221012070506&path-prefix=th",
    "Purify": "https://static.wikia.nocookie.net/arena-of-valor/images/2/22/Purify.png/revision/latest?cb=20221012070519&path-prefix=th",
    "Flicker": "https://static.wikia.nocookie.net/arena-of-valor/images/1/1e/Flicker.png/revision/latest?cb=20221012070534&path-prefix=th"
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1c1f2e] border border-[#d946ef]/30 rounded-2xl p-6 max-w-2xl w-full flex flex-col relative overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-[#d946ef]">เลือกสกิลชาเลนเจอร์ใหม่</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 pb-4">
          {Object.keys(spellData).map((spellName, idx) => (
            <div 
              key={idx} 
              onClick={() => onSelect(spellName, spellIcons[spellName] || 'https://via.placeholder.com/64')}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden group-hover:border-[#d946ef] group-hover:scale-110 transition-all">
                <img src={(spellIcons[spellName] || 'https://via.placeholder.com/64').includes('?') ? (spellIcons[spellName] || 'https://via.placeholder.com/64') + '&v=2' : (spellIcons[spellName] || 'https://via.placeholder.com/64') + '?v=2'} alt={spellName} referrerPolicy="no-referrer" className="w-full h-full object-cover scale-110" />
              </div>
              <span className="text-xs text-center font-['Bebas_Neue'] tracking-widest text-white/70 group-hover:text-white">{spellName}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
