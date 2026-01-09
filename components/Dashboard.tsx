
import React, { useState, useEffect } from 'react';
import { GeneratedShort } from '../types';
import { COST_PER_SHORT } from '../constants';

type GenerationStep = 'idle' | 'analyzing' | 'audio' | 'rendering' | 'finalizing';

interface DashboardProps {
  shorts: GeneratedShort[];
  onViewShort: (short: GeneratedShort) => void;
  onGenerate: (url: string, count: number) => void;
  isGenerating: boolean;
  generationStep?: GenerationStep;
  credits: number;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  shorts, 
  onViewShort, 
  onGenerate, 
  isGenerating, 
  generationStep = 'idle',
  credits 
}) => {
  const [url, setUrl] = useState('');
  const [count, setCount] = useState(1);
  const [activeShareId, setActiveShareId] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const totalCost = count * COST_PER_SHORT;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url && !isGenerating && credits >= totalCost) {
      onGenerate(url, count);
    }
  };

  const adjustCount = (delta: number) => {
    setCount(prev => Math.max(1, Math.min(10, prev + delta)));
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(id);
      setTimeout(() => setCopySuccess(null), 2000);
      return true;
    } catch (err) {
      console.error("Failed to copy", err);
      return false;
    }
  };

  const handleDownload = async (e: React.MouseEvent, short: GeneratedShort) => {
    e.stopPropagation();
    setIsDownloading(short.id);
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = short.url;
      link.setAttribute('download', `${short.title.replace(/\s+/g, '_')}.mp4`);
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(null);
    }, 1000);
  };

  const handleSocialAction = async (e: React.MouseEvent, short: GeneratedShort, platform: 'tiktok' | 'instagram' | 'generic') => {
    e.stopPropagation();
    const caption = `🔥 ${short.hook} \n\nGénéré avec Clopshort IA #Clopshort #AI #Viral`;
    const shareUrl = short.url;

    if (platform === 'generic') {
      if (navigator.share) {
        try {
          await navigator.share({ title: short.title, text: caption, url: shareUrl });
        } catch (err) { copyToClipboard(shareUrl, short.id); }
      } else {
        copyToClipboard(`${caption} \n\nLien: ${shareUrl}`, short.id);
      }
      return;
    }

    const success = await copyToClipboard(caption, short.id + platform);
    if (success) {
      const platformNames = { tiktok: 'TikTok', instagram: 'Instagram' };
      const platformUrls = { tiktok: 'https://www.tiktok.com/upload', instagram: 'https://www.instagram.com/' };
      alert(`✅ Légende virale copiée !\n\nProchaine étape : Ouvre ${platformNames[platform]}, importe ta vidéo et colle le texte en description.`);
      window.open(platformUrls[platform], '_blank');
    }
  };

  const steps = [
    { id: 'analyzing', label: 'Analyse Vidéo', icon: 'fa-magnifying-glass-chart' },
    { id: 'audio', label: 'Audio & Sous-titres', icon: 'fa-microphone-lines' },
    { id: 'rendering', label: 'Rendu Shotstack', icon: 'fa-clapperboard' },
    { id: 'finalizing', label: 'Finalisation R2', icon: 'fa-cloud-arrow-up' },
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === generationStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <section className="relative overflow-hidden bg-zinc-900 rounded-[2.5rem] p-8 md:p-16 text-center shadow-2xl border border-zinc-800">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ff0000,transparent)]"></div>
        </div>
        
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full whitespace-nowrap">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Mon Solde :</span>
          <span className="text-sm font-black text-red-500">{credits} ⚡</span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 pt-6">
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-tight uppercase">
            TRANSFORME TES VIDEOS <br/> EN SHORTS <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">VIRAUX</span>
          </h2>
          
          {!isGenerating ? (
            <>
              <p className="text-zinc-300 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                L'IA de Clopshort analyse, <span className="text-white font-bold">découpe, fait le montage automatiquement</span> et te livre des pépites <span className="text-white font-bold">hyper virales</span>.
              </p>
              
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-md">
                <div className="flex flex-col sm:flex-row gap-3 w-full">
                  <div className="relative flex-grow">
                    <i className="fab fa-youtube absolute left-4 top-1/2 -translate-y-1/2 text-red-600 text-xl"></i>
                    <input 
                      type="text" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Colle ton lien YouTube ici..." 
                      className="w-full bg-transparent text-white py-4 pl-12 pr-4 focus:outline-none placeholder:text-zinc-500 border-b border-white/10 sm:border-none font-medium"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 px-4 bg-black/20 rounded-xl border border-white/5 py-2 sm:py-0">
                    <button type="button" onClick={() => adjustCount(-1)} disabled={count <= 1} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30 transition-all">
                      <i className="fas fa-minus text-[10px]"></i>
                    </button>
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-xl font-black text-white leading-none">{count}</span>
                      <span className="text-[8px] font-black text-zinc-500 uppercase tracking-tighter">Shorts</span>
                    </div>
                    <button type="button" onClick={() => adjustCount(1)} disabled={count >= 10} className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 disabled:opacity-30 transition-all">
                      <i className="fas fa-plus text-[10px]"></i>
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!url || credits < totalCost}
                  className={`w-full py-4 rounded-xl font-black italic whitespace-nowrap transition-all flex items-center justify-center gap-3 ${
                    !url || credits < totalCost ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-500 shadow-xl shadow-red-600/20 active:scale-95'
                  }`}
                >
                  <i className="fas fa-bolt"></i>
                  <span>GÉNÉRER ({totalCost}⚡)</span>
                </button>
              </form>
            </>
          ) : (
            <div className="mt-8 space-y-10 animate-in zoom-in-95 duration-500">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-3xl text-white animate-pulse shadow-[0_0_40px_rgba(220,38,38,0.4)]">
                     <i className={`fas ${steps.find(s => s.id === generationStep)?.icon || 'fa-gear'} fa-spin`}></i>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-black italic text-white uppercase tracking-tighter">Magie en cours...</h4>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">Ne ferme pas cette page</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {steps.map((step) => {
                    const status = getStepStatus(step.id);
                    return (
                      <div key={step.id} className={`p-4 rounded-2xl border transition-all duration-500 flex flex-col items-center gap-3 ${
                        status === 'active' ? 'bg-white/10 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.2)]' : 
                        status === 'completed' ? 'bg-green-500/10 border-green-500/50 opacity-60' : 
                        'bg-black/20 border-white/5 opacity-30'
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${
                          status === 'active' ? 'bg-red-600 text-white' : 
                          status === 'completed' ? 'bg-green-600 text-white' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                           <i className={`fas ${status === 'completed' ? 'fa-check' : step.icon}`}></i>
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-tighter ${
                          status === 'active' ? 'text-white' : 
                          status === 'completed' ? 'text-green-500' : 'text-zinc-500'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
               </div>
            </div>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-2xl font-black italic flex items-center gap-3 tracking-tighter uppercase">
            <div className="w-2 h-8 bg-red-600 rounded-full"></div>
            Mes Créations
          </h3>
          <span className="bg-zinc-100 text-zinc-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{shorts.length} Shorts</span>
        </div>
        
        {shorts.length === 0 ? (
          <div className="border-2 border-dashed border-zinc-100 rounded-[2.5rem] p-24 text-center bg-zinc-50/30">
            <div className="w-20 h-20 bg-white border border-zinc-100 rounded-3xl flex items-center justify-center text-zinc-200 text-3xl mx-auto mb-6 shadow-sm">
               <i className="fas fa-film"></i>
            </div>
            <p className="text-zinc-400 font-bold uppercase text-xs tracking-widest">Tes futurs clips viraux apparaîtront ici.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {shorts.map(short => (
              <div 
                key={short.id} 
                className="group relative bg-white rounded-[2rem] overflow-hidden border border-zinc-100 hover:border-red-600/20 hover:shadow-[0_25px_60px_-15px_rgba(220,38,38,0.15)] hover:-translate-y-2 transition-all duration-500 cursor-pointer"
                onClick={() => onViewShort(short)}
              >
                <div className="aspect-[9/16] relative overflow-hidden bg-black rounded-[2rem]">
                  <img src={short.thumbnail} alt={short.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>
                  
                  <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
                    <button onClick={(e) => { e.stopPropagation(); setActiveShareId(activeShareId === short.id ? null : short.id); }} className={`w-10 h-10 rounded-full backdrop-blur-md text-white border flex items-center justify-center transition-all shadow-xl ${activeShareId === short.id ? 'bg-red-600 border-red-500' : 'bg-black/40 border-white/20 hover:bg-white hover:text-black'}`}>
                      <i className={`fas ${activeShareId === short.id ? 'fa-times' : 'fa-share-alt'}`}></i>
                    </button>
                    {activeShareId === short.id && (
                      <div className="flex flex-col gap-2 animate-in slide-in-from-top-2 duration-300">
                        <button onClick={(e) => handleSocialAction(e, short, 'tiktok')} className="w-10 h-10 rounded-full bg-black text-white border border-zinc-700 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><i className="fab fa-tiktok"></i></button>
                        <button onClick={(e) => handleSocialAction(e, short, 'instagram')} className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><i className="fab fa-instagram"></i></button>
                        <button onClick={(e) => handleDownload(e, short)} disabled={isDownloading === short.id} className="w-10 h-10 rounded-full bg-blue-600 text-white border border-blue-400 flex items-center justify-center hover:scale-110 transition-transform shadow-lg disabled:opacity-50">{isDownloading === short.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-download"></i>}</button>
                        <button onClick={(e) => handleSocialAction(e, short, 'generic')} className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${copySuccess?.startsWith(short.id) ? 'bg-green-600 border-green-400 text-white' : 'bg-white text-zinc-900 border-zinc-200 shadow-lg'}`}><i className={`fas ${copySuccess?.startsWith(short.id) ? 'fa-check' : 'fa-link'}`}></i></button>
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] font-black text-white italic tracking-widest">9:16 HD</span>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                     <div className="inline-block bg-red-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-sm mb-2 transform -rotate-1 group-hover:rotate-0 transition-transform">{short.hook}</div>
                     <h4 className="font-black italic text-lg leading-tight truncate uppercase tracking-tighter group-hover:text-red-500 transition-colors">{short.title}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
