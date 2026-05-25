'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export default function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bg-surface/80 backdrop-blur-xl border-b border-white/10 shadow-[0_0_15px_rgba(251,211,102,0.1)] flex justify-between items-center px-6 md:px-12 h-20 w-full sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <div className="text-2xl font-['Bebas_Neue'] text-primary tracking-widest uppercase">
          ARENA OF VALOR DB
        </div>
        <div className="hidden md:flex gap-6 mt-1">
          <Link href="/" className={`text-xs font-bold uppercase tracking-widest ${pathname === '/' ? 'text-primary border-b-2 border-primary pb-1 scale-95' : 'text-on-surface-variant hover:text-on-surface transition-colors'}`}>HEROES</Link>
          <Link href="/meta" className={`text-xs font-bold uppercase tracking-widest ${pathname === '/meta' ? 'text-primary border-b-2 border-primary pb-1 scale-95' : 'text-on-surface-variant hover:text-on-surface transition-colors'}`}>META</Link>
          <Link href="/guide" className={`text-xs font-bold uppercase tracking-widest ${pathname === '/guide' ? 'text-primary border-b-2 border-primary pb-1 scale-95' : 'text-on-surface-variant hover:text-on-surface transition-colors'}`}>GUIDE</Link>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">search</span>
        </button>
      </div>
    </nav>
  );
}
