
import express from 'express';
import crypto from 'crypto';
import { db } from '../services/firebaseAdmin';
import admin from 'firebase-admin';

const router = express.Router();
const IPN_SECRET = process.env.NOWPAYMENTS_IPN_SECRET;

router.post('/ipn', async (req, res) => {
  const ipnSignature = req.headers['x-nowpayments-sig'];
  
  if (!IPN_SECRET) {
    console.error("IPN Secret missing in .env");
    return res.status(500).send('Config error');
  }

  const hmac = crypto.createHmac('sha512', IPN_SECRET);
  hmac.update(JSON.stringify(req.body, Object.keys(req.body).sort()));
  const signature = hmac.digest('hex');

  if (signature !== ipnSignature) {
    console.warn("⚠️ Invalid IPN Signature");
    return res.status(400).send('Invalid signature');
  }

  const { payment_status, order_id } = req.body;

  if (payment_status === 'finished') {
    const userRef = db.collection('users').doc(order_id);
    await userRef.update({
      credits: admin.firestore.FieldValue.increment(150)
    });
    console.log(`💰 [PAYMENT] 150 credits added to user: ${order_id}`);
  }

  res.status(200).send('OK');
});

export default router;
