import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function ItemSelectorModal({ onClose, onSelect }: { onClose: () => void, onSelect: (item: any) => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/items')
      .then(res => {
        if (res.data.success) {
          setItems(res.data.data);
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
        className="bg-[#1c1f2e] border border-[#FBD366]/30 rounded-2xl p-6 max-w-3xl w-full max-h-[80vh] flex flex-col relative overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-[#FBD366]">เลือกไอเทมใหม่</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {loading ? (
             <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FBD366]"></div></div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 pb-4">
              {items.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => onSelect(item)}
                  className="flex flex-col items-center gap-2 cursor-pointer group bg-black/20 p-2 rounded-xl border border-white/5 hover:bg-white/5 transition-all relative"
                >
                  <div className="w-16 h-16 border-2 border-white/20 rounded overflow-hidden group-hover:border-[#FBD366] group-hover:scale-110 transition-all">
                    <img src={(item.imageFile || (item as any).icon || '').includes('?') ? (item.imageFile || (item as any).icon) + '&v=2' : (item.imageFile || (item as any).icon) + '?v=2'} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center w-full">
                    <span className="text-xs font-bold text-center text-white/90 group-hover:text-white line-clamp-2 leading-tight">{item.name}</span>
                    <div className="mt-1 flex justify-center items-center text-[#FBD366] text-[10px] font-bold">
                      <span className="material-symbols-outlined text-[10px] mr-1">monetization_on</span> {item.price || 0}
                    </div>
                  </div>
                  
                  {/* Hover Tooltip for Data/Stats */}
                  <div className="absolute opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#1c1f2e] border border-[#FBD366]/50 rounded-lg p-3 shadow-2xl z-50">
                    <div className="text-sm font-bold text-[#FBD366] mb-1">{item.name}</div>
                    <div className="text-xs text-white/90 whitespace-pre-line mb-2">{item.stats}</div>
                    {item.passive && <div className="text-[10px] text-blue-300">{item.passive}</div>}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1c1f2e] border-b border-r border-[#FBD366]/50 rotate-45"></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
