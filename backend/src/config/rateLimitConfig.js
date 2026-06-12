import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from './constants.js';

export const limiter = rateLimit({
	windowMs: RATE_LIMIT.windowMs,
	max: RATE_LIMIT.max,
	message: { error: RATE_LIMIT.message },
	standardHeaders: true,
	legacyHeaders: false
});

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5, // Solo 5 intentos de login/registro por 15 minutos
	skipSuccessfulRequests: true,
	message: { error: 'Demasiados intentos, intenta de nuevo en 15 minutos' }
});