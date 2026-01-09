
import admin from 'firebase-admin';
import { CONFIG } from '../config';

if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(CONFIG.FIREBASE.SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (e) {
    console.error("Erreur initialisation Firebase Admin: Vérifiez FIREBASE_SERVICE_ACCOUNT");
    // Fallback pour le développement local si les credentials ADC sont présents
    admin.initializeApp();
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
