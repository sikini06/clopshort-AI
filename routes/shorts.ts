
import express from 'express';
import OpenAI from 'openai';
import { db } from '../services/firebaseAdmin';
import { authenticateToken } from '../middleware/auth';
import { shotstackService } from '../services/shotstackService';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/generate', authenticateToken, async (req: any, res) => {
  const { videoUrl, count } = req.body;
  const userId = req.user.uid;

  try {
    // 1. Vérifier les crédits
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();
    const cost = count * 6;

    if (!userData || userData.credits < cost) {
      return res.status(403).json({ error: 'Crédits insuffisants' });
    }

    // 2. Analyse IA avec OpenAI (Simulation de l'analyse car on ne télécharge pas)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Tu es un expert en viralité. Analyse l'URL fournie et propose des segments de 15s à 60s." },
        { role: "user", content: `Analyse cette vidéo YouTube : ${videoUrl} et donne moi ${count} segments viraux.` }
      ],
      response_format: { type: "json_object" }
    });

    // 3. Appel à Shotstack pour créer le montage cloud
    const editResult = await shotstackService.render(videoUrl, count);

    // 4. Déduire les crédits
    await userRef.update({ credits: userData.credits - cost });

    res.json({ 
      message: 'Génération lancée', 
      jobId: editResult.id,
      status: 'processing'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur de génération' });
  }
});

export default router;
