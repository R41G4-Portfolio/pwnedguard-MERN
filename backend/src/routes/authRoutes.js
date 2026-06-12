import express from 'express';
import AuthCommands from '../commands/authCommands.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { validateSignup, validateLogin, sanitizeOutput } from '../middleware/validationMiddleware.js';
import { setAuthCookies, clearAuthCookies } from '../config/cookieConfig.js';
import { authLimiter } from '../config/rateLimitConfig.js';

const router = express.Router();

router.post('/signup', authLimiter, validateSignup, async (req, res) => {
	try {
		const { email, password, name } = req.validatedBody;
		const userAgent = req.headers['user-agent'];
		const ipAddress = req.ip;

		const { user, token, expiresAt } = await AuthCommands.register(email, password, name, userAgent, ipAddress);
		
		setAuthCookies(res, token, { ...user, exp: Math.floor(expiresAt / 1000) });

		// Sanitizar respuesta para prevenir XSS
		const sanitizedUser = sanitizeOutput(user);
		res.status(201).json(sanitizedUser);
	} catch (error) {
		res.status(400).json({ error: sanitizeOutput(error.message) });
	}
});

router.post('/signin', authLimiter, validateLogin, async (req, res) => {
	try {
		const { email, password } = req.validatedBody;
		const userAgent = req.headers['user-agent'];
		const ipAddress = req.ip;

		const { user, token, expiresAt } = await AuthCommands.login(email, password, userAgent, ipAddress);
		
		setAuthCookies(res, token, { ...user, exp: Math.floor(expiresAt / 1000) });

		// Sanitizar respuesta para prevenir XSS
		const sanitizedUser = sanitizeOutput(user);
		res.json(sanitizedUser);
	} catch (error) {
		res.status(401).json({ error: sanitizeOutput(error.message) });
	}
});

router.post('/logout', authenticateToken, async (req, res) => {
	try {
		await AuthCommands.logout(req.user.rid, req.user.jti);
		clearAuthCookies(res);
		res.json({ message: sanitizeOutput('Sesión cerrada correctamente') });
	} catch (error) {
		res.status(500).json({ error: sanitizeOutput(error.message) });
	}
});

export default router;