
import React from 'react';
import { Logo } from '../constants';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: UserProfile;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onNavigate, currentPage }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      {/* Header / Top Navigation */}
      <header className="h-20 border-b border-zinc-100 px-6 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <Logo size={32} />
          <h1 className="text-xl font-bold tracking-tighter text-black">CLOPSHORT</h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 bg-zinc-50 border border-zinc-100 px-4 py-2 rounded-full">
            <span className="text-sm font-bold text-red-600">{user.credits}</span>
            <span className="text-zinc-400 text-xs uppercase font-black tracking-widest">Crédits</span>
            <span className="text-zinc-300">⚡</span>
          </div>
          
          <button 
            onClick={() => onNavigate('shop')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-black italic text-sm transition-all ${
              currentPage === 'shop' 
              ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
              : 'bg-black text-white hover:bg-zinc-800 shadow-lg shadow-zinc-200'
            }`}
          >
            <i className="fas fa-crown text-[10px]"></i>
            PREMIUM
          </button>
        </div>
      </header>

      <div className="flex flex-grow">
        {/* Sidebar - Minimized or removed depending on needs, kept for future tools */}
        <aside className="hidden md:flex w-20 border-r border-zinc-100 flex-col items-center py-8 gap-8 bg-zinc-50/50">
           <SidebarIcon active={currentPage === 'dashboard'} icon="fa-home" onClick={() => onNavigate('dashboard')} />
           <SidebarIcon active={currentPage === 'shop'} icon="fa-gem" onClick={() => onNavigate('shop')} />
        </aside>

        {/* Content Area */}
        <main className="flex-grow overflow-y-auto p-6 md:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarIcon = ({ active, icon, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
      active ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'text-zinc-400 hover:bg-white hover:text-black border border-transparent hover:border-zinc-200'
    }`}
  >
    <i className={`fas ${icon} text-lg`}></i>
  </button>
);

export default Layout;
