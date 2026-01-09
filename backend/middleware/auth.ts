
import { Request, Response, NextFunction } from 'express';
import { auth } from '../services/firebaseAdmin';

export const authenticateToken = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token manquant' });

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token invalide' });
  }
};
