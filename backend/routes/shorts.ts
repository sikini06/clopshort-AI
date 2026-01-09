
import express from 'express';
import OpenAI from 'openai';
import { db } from '../services/firebaseAdmin';
import { authenticateToken } from '../middleware/auth';
import { shotstackService } from '../services/shotstackService';
import { aimlapiService } from '../services/aimlapiService';

const router = express.Router();

router.post('/generate', authenticateToken, async (req: any, res) => {
  const { videoUrl, count, musicStyle } = req.body;
  const userId = req.user.uid;

  // Initialisation dynamique d'OpenAI pour s'assurer que process.env est chargé
  const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
  });

  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const cost = count * 6;

    if (!userData || userData.credits < cost) {
      return res.status(403).json({ error: 'Crédits insuffisants' });
    }

    // 1. Analyse IA avec OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { 
          role: "system", 
          content: "Tu es un expert en viralité. Analyse la vidéo et retourne un JSON avec un tableau 'segments' contenant 'start', 'end', 'hook' (phrase courte) et 'title'." 
        },
        { role: "user", content: `Vidéo YouTube : ${videoUrl}. Sors moi ${count} segments viraux.` }
      ],
      response_format: { type: "json_object" }
    });

    const analysis = JSON.parse(completion.choices[0].message.content || '{"segments":[]}');
    
    // 2. Récupération musique
    const musicUrl = await aimlapiService.getBackgroundMusic(musicStyle);

    // 3. Montage Cloud
    const editResult = await shotstackService.render(videoUrl, analysis.segments, musicUrl);

    // 4. Déduire les crédits
    await userRef.update({ 
      credits: userData.credits - cost 
    });

    res.json({ 
      message: 'Génération lancée avec succès', 
      jobId: editResult.response?.id,
      status: 'processing',
      segments: analysis.segments
    });
  } catch (err) {
    console.error('Erreur Shorts Generate:', err);
    res.status(500).json({ error: 'Erreur lors de la génération des clips' });
  }
});

export default router;
