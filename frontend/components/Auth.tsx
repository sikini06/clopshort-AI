
import React, { useState } from 'react';
import { Logo } from '../constants';
import { auth, db } from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

interface AuthProps {
  onLogin: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        onLogin({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          ...userDoc.data()
        });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const initialData = {
          credits: 50,
          createdAt: Date.now(),
          email: email
        };
        await setDoc(doc(db, "users", userCredential.user.uid), initialData);
        onLogin({
          uid: userCredential.user.uid,
          ...initialData
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 relative">
      <div className="absolute inset-0 bg-zinc-50/50 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-md bg-white border border-zinc-100 p-10 rounded-[2.5rem] shadow-2xl">
        <div className="flex flex-col items-center gap-6 text-center mb-8">
          <Logo size={60} />
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full bg-zinc-50 p-4 rounded-xl border border-zinc-100 outline-none focus:border-red-600 transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            className="w-full bg-zinc-50 p-4 rounded-xl border border-zinc-100 outline-none focus:border-red-600 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            disabled={loading}
            className="w-full bg-black text-white p-4 rounded-xl font-black italic hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-bolt text-red-500"></i>}
            {isLogin ? 'SE CONNECTER' : 'CRÉER UN COMPTE'}
          </button>
        </form>

        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-6 text-zinc-400 text-sm font-bold hover:text-black transition-colors"
        >
          {isLogin ? "Pas de compte ? S'inscrire" : "Déjà membre ? Se connecter"}
        </button>
      </div>
    </div>
  );
};

export default Auth;
