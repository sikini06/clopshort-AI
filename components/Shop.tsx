
import React, { useState } from 'react';
import { CREDIT_PACKS } from '../constants';

interface ShopProps {
  onBuy: (packId: string) => void;
  onBack: () => void;
}

/**
 * Composant interne pour afficher les avantages d'un pack.
 */
const Benefit = ({ icon, text, highlight = false }: { icon: string; text: string; highlight?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${highlight ? 'bg-red-100 text-red-600' : 'bg-zinc-100 text-zinc-400'}`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <span className={`text-sm font-bold ${highlight ? 'text-black' : 'text-zinc-500'}`}>{text}</span>
  </div>
);

const Shop: React.FC<ShopProps> = ({ onBack }) => {
  const [showFallback, setShowFallback] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // URL de paiement NOWPayments
  const paymentUrl = "https://nowpayments.io/payment/?iid=5100912752";

  const handlePaymentClick = (e: React.MouseEvent) => {
    // Tentative 1: Ouverture standard
    const win = window.open(paymentUrl, '_blank');
    
    // Tentative 2: Si bloqué par popup blocker ou sandbox
    if (!win || win.closed || typeof win.closed === 'undefined') {
      try {
        window.location.assign(paymentUrl);
      } catch (err) {
        // Tentative 3: Forcer via le top level si possible
        try {
          if (window.top) window.top.location.href = paymentUrl;
        } catch (e2) {
          console.error("Navigation bloquée par la sandbox");
        }
      }
    }

    // Fallback: Copier le lien et afficher l'interface de secours
    navigator.clipboard.writeText(paymentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
    setShowFallback(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-start mb-4">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-zinc-400 hover:text-black transition-colors font-bold text-sm"
        >
          <i className="fas fa-arrow-left transition-transform group-hover:-translate-x-1"></i>
          Retour au Dashboard
        </button>
      </div>

      <div className="text-center space-y-4">
        <h2 className="text-5xl font-black italic tracking-tighter text-black uppercase leading-tight">
          ACTIVE TON PASS <br/> 
          <span className="text-red-600">VIRALITÉ</span>
        </h2>
        <p className="text-zinc-500 text-lg font-medium italic">L'outil indispensable pour dominer les réseaux.</p>
      </div>

      <div className="flex flex-col items-center gap-8">
        {CREDIT_PACKS.map(pack => (
          <div 
            key={pack.id} 
            className="relative w-full max-w-lg p-10 rounded-[3rem] border border-zinc-100 bg-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] space-y-8 flex flex-col transition-all hover:shadow-[0_40px_100px_-20px_rgba(220,38,38,0.15)]"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black px-8 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg flex items-center gap-2">
              <i className="fas fa-fire text-red-500"></i>
              OFFRE LIMITÉE
            </div>
            
            <div className="text-center">
              <h3 className="text-3xl font-black italic text-black uppercase tracking-tight">{pack.name}</h3>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">{pack.label}</p>
            </div>

            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-7xl font-black text-black tracking-tighter">{pack.credits}</span>
                <div className="flex flex-col items-start">
                  <span className="text-red-600 text-2xl font-black italic leading-none">CRÉDITS</span>
                  <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-tighter">Éclairs ⚡</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-grow px-4">
              <Benefit icon="fa-film" text="Génère jusqu'à 50 shorts par pack" />
              <Benefit icon="fa-music" text="Accès à toutes les musiques de fond IA" />
              <Benefit icon="fa-eye-slash" text="Suppression du filigrane (Watermark)" highlight />
              <Benefit icon="fa-bolt" text="Priorité de rendu haute vitesse" highlight />
              <Benefit icon="fa-share-nodes" text="Partage direct TikTok & Instagram" />
            </div>

            <div className="pt-6 space-y-4">
              <button 
                onClick={handlePaymentClick}
                className="w-full py-6 rounded-2xl bg-black text-white hover:bg-zinc-800 font-black text-2xl italic tracking-tighter transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-zinc-200"
              >
                <span>ACHETER POUR {pack.price}$</span>
                <i className="fas fa-shopping-cart text-xs text-red-500"></i>
              </button>

              {showFallback && (
                <div className="animate-in fade-in zoom-in duration-300 p-6 bg-red-50 rounded-2xl border border-red-100 space-y-4">
                  <p className="text-red-600 text-xs font-black uppercase tracking-tight text-center leading-tight">
                    Si la page ne s'ouvre pas automatiquement :
                  </p>
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(paymentUrl);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="w-full py-3 bg-white border border-red-200 rounded-xl text-[10px] font-black uppercase text-red-600 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                    >
                      <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                      {copied ? 'Lien copié !' : 'Copier le lien de paiement'}
                    </button>
                    <a 
                      href={paymentUrl} 
                      target="_blank" 
                      className="text-[9px] text-zinc-400 break-all text-center underline hover:text-red-600"
                    >
                      {paymentUrl}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-50/50 p-10 rounded-[3rem] border border-zinc-100 text-center space-y-8">
        <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">Paiement 100% sécurisé via NOWPayments</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-80">
           <div className="flex items-center gap-3 text-zinc-800 grayscale hover:grayscale-0 transition-all">
             <i className="fab fa-stripe text-5xl"></i>
           </div>
           <div className="flex items-center gap-2 font-black text-2xl italic tracking-tighter">
             <i className="fab fa-bitcoin text-3xl text-[#F7931A]"></i> BTC
           </div>
           <div className="flex items-center gap-2 font-black text-2xl italic tracking-tighter">
             <i className="fab fa-ethereum text-3xl text-[#627EEA]"></i> ETH
           </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
