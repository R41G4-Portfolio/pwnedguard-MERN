import 'dotenv/config';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import AuthQueries from '../queries/authQueries.js';

export const authenticateToken = async (req, res, next) => {
	try {
		const token = req.cookies?.auth_token;
		
		if (!token) {
			return res.status(401).json({ error: 'No autorizado' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const tokenHash = crypto.createHash('sha256').update(decoded.jti).digest('hex');
		
		const isValid = await AuthQueries.verifySession(decoded.rid, tokenHash);
		
		if (!isValid) {
			return res.status(401).json({ error: 'Sesión inválida o expirada' });
		}

		req.user = { rid: decoded.rid, email: decoded.email, jti: decoded.jti };
		next();
	} catch (error) {
		if (error.name === 'JsonWebTokenError') {
			return res.status(401).json({ error: 'Token inválido' });
		}
		if (error.name === 'TokenExpiredError') {
			return res.status(401).json({ error: 'Token expirado' });
		}
		return res.status(500).json({ error: 'Error de autenticación' });
	}
};