
import React, { useState } from 'react';
import { Logo } from '../constants';

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulation d'appel API (à connecter au backend Railway)
    setTimeout(() => {
      onLogin({
        uid: 'user_' + Math.random(),
        email: email,
        credits: 50,
        displayName: email.split('@')[0]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 overflow-hidden relative">
      {/* Background Decor - Plus subtil et lumineux */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-red-50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-100 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-zinc-100 p-8 md:p-12 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] space-y-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="p-1 bg-zinc-50 rounded-2xl border border-zinc-100 shadow-sm">
              <Logo size={64} />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-black italic text-black uppercase tracking-tighter">
                {isLogin ? 'Bon retour !' : 'Rejoins l\'élite'}
              </h1>
              <p className="text-zinc-500 text-sm font-bold">
                {isLogin ? 'Tes futurs clips viraux t\'attendent.' : 'Commence à dominer les algorithmes.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-5">Adresse Email</label>
              <div className="relative">
                <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300"></i>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-zinc-50 border border-zinc-100 text-black px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-600 transition-all placeholder:text-zinc-300 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-5">Mot de passe</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300"></i>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-100 text-black px-14 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-600 transition-all placeholder:text-zinc-300 font-medium"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-black hover:bg-zinc-800 text-white font-black italic text-xl py-5 rounded-2xl shadow-xl shadow-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-3 mt-2"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin text-red-500"></i> : <i className="fas fa-bolt text-red-500"></i>}
              <span>{isLogin ? 'SE CONNECTER' : 'CRÉER MON COMPTE'}</span>
            </button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-zinc-300 bg-white px-4">Ou</div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="group text-zinc-500 hover:text-black text-sm font-bold transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin ? "Pas encore de compte ?" : "Déjà membre ?"} 
              <span className="text-red-600 group-hover:underline">{isLogin ? "Inscris-toi" : "Connecte-toi"}</span>
            </button>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center gap-4">
           <div className="flex items-center gap-4 opacity-40">
              <i className="fab fa-google text-zinc-400 hover:text-black cursor-pointer transition-colors"></i>
              <i className="fab fa-apple text-zinc-400 hover:text-black cursor-pointer transition-colors"></i>
              <i className="fab fa-facebook text-zinc-400 hover:text-black cursor-pointer transition-colors"></i>
           </div>
           <p className="text-zinc-300 text-[9px] font-black uppercase tracking-[0.3em]">
             Sécurisé par Firebase & Railway
           </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
