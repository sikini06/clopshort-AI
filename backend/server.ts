
import express from 'express';
import cors from 'cors';
import { CONFIG } from './config';
import authRoutes from './routes/auth';
import shortsRoutes from './routes/shorts';
import paymentRoutes from './routes/payment';

const app = express();
const PORT = process.env.PORT || 8080; // GCP utilise souvent 8080

app.use(cors());
app.use(express.json());

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/shorts', shortsRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'clopshort-backend',
    env: process.env.NODE_ENV || 'production'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend Clopshort démarré sur le port ${PORT}`);
});
