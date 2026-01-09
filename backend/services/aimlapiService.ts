
import fetch from 'node-fetch';

export const aimlapiService = {
  async getBackgroundMusic(style: string = 'viral') {
    const AIMLAPI_KEY = process.env.AIMLAPI_KEY;
    
    // Fallback URL si l'API n'est pas appelée directement
    const musicOptions = {
      'viral': 'https://6df7d9505816cf712beb294213bc117c.r2.cloudflarestorage.com/assets/music/viral_beat.mp3',
      'motivation': 'https://6df7d9505816cf712beb294213bc117c.r2.cloudflarestorage.com/assets/music/intense_piano.mp3',
      'funny': 'https://6df7d9505816cf712beb294213bc117c.r2.cloudflarestorage.com/assets/music/funny_bounce.mp3'
    };
    
    return musicOptions[style as keyof typeof musicOptions] || musicOptions['viral'];
  }
};
