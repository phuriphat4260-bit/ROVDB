import Link from 'next/link';
import { motion } from 'framer-motion';

const getRoleStyles = (role: string) => {
  switch (role.toLowerCase()) {
    case 'assassin': return { border: 'hover:border-assassin-purple/50', shadow: 'hover:shadow-[0_0_20px_rgba(160,97,255,0.3)]', text: 'text-assassin-purple', bg: 'bg-assassin-purple/20', borderIcon: 'border-assassin-purple/30', icon: 'swords' };
    case 'tank': return { border: 'hover:border-tank-cyan/50', shadow: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]', text: 'text-tank-cyan', bg: 'bg-tank-cyan/20', borderIcon: 'border-tank-cyan/30', icon: 'shield' };
    case 'mage': return { border: 'hover:border-mage-indigo/50', shadow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)]', text: 'text-mage-indigo', bg: 'bg-mage-indigo/20', borderIcon: 'border-mage-indigo/30', icon: 'magic_button' };
    case 'marksman': return { border: 'hover:border-warrior-red/50', shadow: 'hover:shadow-[0_0_20px_rgba(255,77,77,0.3)]', text: 'text-warrior-red', bg: 'bg-warrior-red/20', borderIcon: 'border-warrior-red/30', icon: 'target' };
    case 'support': return { border: 'hover:border-support-green/50', shadow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]', text: 'text-support-green', bg: 'bg-support-green/20', borderIcon: 'border-support-green/30', icon: 'favorite' };
    default: return { border: 'hover:border-primary/50', shadow: 'hover:shadow-[0_0_20px_rgba(251,211,102,0.3)]', text: 'text-primary', bg: 'bg-primary/20', borderIcon: 'border-primary/30', icon: 'person' };
  }
};

export default function HeroCard({ hero }: { hero: any }) {
  const primaryRole = hero.classes[0] || 'Unknown';
  const styles = getRoleStyles(primaryRole);

  return (
    <Link href={`/hero/${hero.slug}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className={`group relative aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-high/60 backdrop-blur-md border border-outline-variant/20 transition-all duration-300 ${styles.border} ${styles.shadow} block cursor-pointer`}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
          style={{ backgroundImage: `url('${hero.splashArt || hero.avatar}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-dark via-obsidian-dark/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end">
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-6 h-6 rounded flex items-center justify-center ${styles.bg} ${styles.text} border ${styles.borderIcon}`}>
              <span className="material-symbols-outlined text-[14px]">{styles.icon}</span>
            </span>
            <span className={`text-xs font-bold tracking-widest uppercase ${styles.text}`}>
              {primaryRole}
            </span>
          </div>
          <h3 className="text-2xl font-['Bebas_Neue'] text-white uppercase tracking-wide">{hero.name}</h3>
        </div>
      </motion.div>
    </Link>
  );
}
