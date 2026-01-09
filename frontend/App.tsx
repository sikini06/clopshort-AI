
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Shop from './components/Shop';
import Auth from './components/Auth';
import { UserProfile, GeneratedShort, AppNotification } from './types';
import { COST_PER_SHORT } from './constants';

type GenerationStep = 'idle' | 'analyzing' | 'audio' | 'rendering' | 'finalizing';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [shorts, setShorts] = useState<GeneratedShort[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<GenerationStep>('idle');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('clopshort_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('clopshort_user', JSON.stringify(userData));
    addNotification(`Heureux de vous revoir, ${userData.displayName} !`, 'success');
  };

  const handleGenerate = async (url: string, count: number) => {
    if (!user) return;
    const totalCost = count * COST_PER_SHORT;

    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      addNotification("Veuillez entrer un lien YouTube valide.", "error");
      return;
    }

    if (user.credits < totalCost) {
      addNotification(`Crédits insuffisants (${totalCost}⚡ requis).`, "error");
      setCurrentPage('shop');
      return;
    }

    setIsGenerating(true);
    
    try {
      setGenerationStep('analyzing');
      await new Promise(r => setTimeout(r, 2000));
      setGenerationStep('audio');
      await new Promise(r => setTimeout(r, 2500));
      setGenerationStep('rendering');
      await new Promise(r => setTimeout(r, 3000));
      setGenerationStep('finalizing');
      await new Promise(r => setTimeout(r, 1500));

      const newShorts: GeneratedShort[] = Array(count).fill(0).map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        title: "Clip Viral " + Math.floor(Math.random() * 100),
        url: url,
        thumbnail: `https://picsum.photos/seed/${Math.random()}/720/1280`,
        createdAt: Date.now(),
        status: 'completed' as const,
        hook: "INCROYABLE REBONDISSEMENT 🔥"
      }));

      setShorts(prev => [...newShorts, ...prev]);
      setUser(prev => prev ? ({ ...prev, credits: prev.credits - totalCost }) : null);
      addNotification(`${count} shorts générés avec succès !`, 'success');
    } catch (error) {
      addNotification("Erreur lors de la génération.", "error");
    } finally {
      setIsGenerating(false);
      setGenerationStep('idle');
    }
  };

  const addNotification = (message: string, type: AppNotification['type']) => {
    const newNote = { id: Date.now().toString(), message, type, timestamp: Date.now() };
    setNotifications(prev => [newNote, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNote.id));
    }, 4000);
  };

  if (!user) return <Auth onLogin={handleLogin} />;

  return (
    <Layout user={user} onNavigate={setCurrentPage} currentPage={currentPage}>
      {currentPage === 'dashboard' && (
        <Dashboard 
          shorts={shorts} 
          onViewShort={(s) => window.open(s.url, '_blank')} 
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          generationStep={generationStep}
          credits={user.credits}
        />
      )}
      {currentPage === 'shop' && (
        <Shop onBack={() => setCurrentPage('dashboard')} />
      )}
    </Layout>
  );
};

export default App;
