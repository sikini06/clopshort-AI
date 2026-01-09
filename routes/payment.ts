
import express from 'express';
import crypto from 'crypto';
// Importation fictive pour illustrer la logique de base de données
// import { db } from '../services/firebaseAdmin';

const router = express.Router();

router.post('/ipn', async (req, res) => {
  const ipnSignature = req.headers['x-nowpayments-sig'];
  const secret = process.env.NOWPAYMENTS_IPN_SECRET;
  
  if (!secret) return res.status(500).send('Secret non configuré');

  // Notification IPN validation
  const hmac = crypto.createHmac('sha512', secret);
  hmac.update(JSON.stringify(req.body, Object.keys(req.body).sort()));
  const signature = hmac.digest('hex');

  if (signature !== ipnSignature) {
    return res.status(400).send('Signature invalide');
  }

  const { payment_status, order_id, pay_amount, price_amount } = req.body;

  if (payment_status === 'finished') {
    // Logique pour créditer l'utilisateur
    // order_id doit correspondre à l'UID de l'utilisateur stocké lors de la création du lien
    console.log(`Paiement validé pour l'utilisateur ${order_id}. Montant: ${price_amount}`);
    
    // Exemple de mise à jour Firestore:
    // await db.collection('users').doc(order_id).update({ 
    //   credits: admin.firestore.FieldValue.increment(150) 
    // });
  }

  res.status(200).send('OK');
});

export default router;
