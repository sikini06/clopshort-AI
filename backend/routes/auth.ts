
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../services/firebaseAdmin';
import { CONFIG } from '../config';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    
    if (!userSnapshot.empty) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = await db.collection('users').add({
      email,
      password: hashedPassword,
      credits: 50,
      createdAt: Date.now()
    });

    const token = jwt.sign({ uid: userRef.id, email }, CONFIG.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: userRef.id, email, credits: 50 } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const userSnapshot = await db.collection('users').where('email', '==', email).get();
    
    if (userSnapshot.empty) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    const userDoc = userSnapshot.docs[0];
    const user = userDoc.data();
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign({ uid: userDoc.id, email }, CONFIG.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { uid: userDoc.id, email, credits: user.credits } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
});

export default router;
