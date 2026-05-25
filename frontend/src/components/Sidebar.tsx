'use client';

import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="bg-surface-container-low/90 backdrop-blur-lg border-r border-white/5 shadow-2xl h-screen w-64 fixed left-0 top-0 hidden lg:flex flex-col pt-24 z-40">
      <div className="px-6 mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-variant overflow-hidden border border-outline-variant/30 flex-shrink-0">
          <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD756R6NccXMuqJz96WER6eHXIOBFgHoUu5y4WFcjNss0Q2UNFUqXz9PanGNNMGBbHLo5vVYgElo9rVfGdqL2RTkaDPOSG4zpRPYHDPl7M-F5EbnXaljLzNkcELP8FYqS4G4W17cpyaCCy4cg4qdWoA87nAHZMQ6e74vwZrB825fwY1PAM4i7V_41UzpsJNOPrUcSAYbLxFcqFkTcsJzGb6GqYb_yJxhkfATgNbtnkAmX9jxjZv4clZDW6FLye7DAOjDIwe5L2yljs"/>
        </div>
        <div>
          <div className="text-sm font-bold text-on-surface">Guest</div>
          <div className="text-xs font-bold text-primary tracking-widest uppercase">Rank: Unranked</div>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        <Link href="/" className="bg-primary/10 text-primary border-r-4 border-primary px-6 py-4 flex items-center gap-4 transition-all">
          <span className="material-symbols-outlined">groups</span>
          <span className="text-xs font-bold tracking-widest uppercase">All Heroes</span>
        </Link>
        <Link href="#" className="text-on-surface-variant hover:bg-white/5 px-6 py-4 flex items-center gap-4 hover:translate-x-2 transition-transform duration-300">
          <span className="material-symbols-outlined">shield</span>
          <span className="text-xs font-bold tracking-widest uppercase">Tank</span>
        </Link>
      </nav>
    </aside>
  );
}
