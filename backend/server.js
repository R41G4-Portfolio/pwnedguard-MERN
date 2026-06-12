import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './src/routes/authRoutes.js';
import { limiter } from './src/config/rateLimitConfig.js';
import { errorHandler } from './src/middleware/errorMiddleware.js';
import { sanitizeInput } from './src/middleware/validationMiddleware.js';

const app = express();
app.set('trust proxy', 1);

//IMPORTANTE: unificar puerto con PM2/Nginx
const PORT = process.env.PORT || 5000;

// Middlewares base
app.use(helmet({
contentSecurityPolicy: {
	directives: {
	defaultSrc: ["'self'"],
	scriptSrc: ["'self'"],
	styleSrc: ["'self'", "'unsafe-inline'"],
	imgSrc: ["'self'", "data:", "https:"],
	connectSrc: ["'self'", "https://api.pwnedpasswords.com"],
	},
},
}));

app.use(cors({
origin: process.env.FRONTEND_URL || '*',
credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use(sanitizeInput);

// Rutas
app.use('/api/auth', authRoutes);

// 404
app.use((req, res) => {
res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use(errorHandler);

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => {
	console.error('❌ Error MongoDB:', err);
	process.exit(1);
});

// Server
app.listen(PORT, '127.0.0.1', () => {
console.log(`🚀 API corriendo en puerto ${PORT}`);
});