
import React from 'react';
import { CreditPack } from './types';

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'pro', name: 'Pack Pro', credits: 150, price: 15, label: 'L\'offre la plus populaire' },
];

export const COST_PER_SHORT = 6;

export const Logo = ({ size = 40 }: { size?: number }) => (
  <div 
    style={{ width: size, height: size }} 
    className="relative flex items-center justify-center group"
  >
    {/* Glow effect de fond */}
    <div className="absolute inset-0 bg-red-600 blur-[8px] opacity-20 group-hover:opacity-40 transition-opacity rounded-xl"></div>
    
    {/* Conteneur principal avec dégradé et forme stylisée */}
    <div className="relative w-full h-full bg-black rounded-xl border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl">
      {/* Accent de dégradé interne */}
      <div className="absolute -bottom-2 -right-2 w-1/2 h-1/2 bg-red-600/20 blur-xl"></div>
      
      {/* Le "C" stylisé avec effet de découpe (Slash) */}
      <div className="relative flex items-center justify-center">
        <span className="text-white font-[900] italic tracking-tighter leading-none select-none translate-x-[1px]" style={{ fontSize: size * 0.65 }}>
          C
        </span>
        {/* Barre de découpe diagonale (le "Slash" de Clopshort) */}
        <div className="absolute w-[200%] h-[2px] bg-red-600 rotate-[45deg] shadow-[0_0_10px_#dc2626]"></div>
      </div>
    </div>
  </div>
);
