import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function RuneSelectorModal({ onClose, onSelect }: { onClose: () => void, onSelect: (rune: any) => void }) {
  const [runes, setRunes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/runes')
      .then(res => {
        if (res.data.success) {
          setRunes(res.data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#1c1f2e] border border-red-500/30 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] flex flex-col relative overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white">เลือกรูนใหม่</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div></div>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 pb-4">
              {runes.map((rune, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onSelect(rune)}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                >
                  <div className={`w-14 h-14 border-2 rounded-full overflow-hidden transition-all group-hover:scale-110 ${rune.color === 'red' ? 'border-red-500' : rune.color === 'green' ? 'border-green-500' : rune.color === 'purple' ? 'border-purple-500' : 'border-[#FBD366]'}`}>
                    <img src={(rune.imageFile || rune.icon || '').includes('?') ? (rune.imageFile || rune.icon) + '&v=2' : (rune.imageFile || rune.icon) + '?v=2'} alt={rune.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] text-center text-white/70 group-hover:text-white line-clamp-2">{rune.name.replace(/LV\s*[1-3]:\s*/i, '')}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
