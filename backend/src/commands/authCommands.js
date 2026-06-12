import 'dotenv/config';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import UserDAO from '../repository/dao/UserDAO.js';
import AuthQueries from '../queries/authQueries.js';
import { JWT_CONFIG, TOKEN_EXPIRY_MS, BCYPT_CONFIG } from '../config/constants.js';

const JWT_SECRET = process.env.JWT_SECRET;

class AuthCommands {
	async register(email, password, name, userAgent, ipAddress) {
		const existingUser = await AuthQueries.getUserByEmail(email, true);
		if (existingUser) {
			throw new Error('El email ya está registrado');
		}

		const passwordHash = await bcrypt.hash(password, BCYPT_CONFIG.saltRounds);
		const rid = crypto.randomUUID();

		const user = await UserDAO.create({
			rid,
			email,
			name,
			passwordHash
		});

		return await this._createSession(user, userAgent, ipAddress);
	}

	async login(email, password, userAgent, ipAddress) {
		const user = await AuthQueries.getUserByEmail(email, true);
		if (!user) {
			throw new Error('Credenciales inválidas');
		}

		const isValid = await bcrypt.compare(password, user.passwordHash);
		if (!isValid) {
			throw new Error('Credenciales inválidas');
		}

		return await this._createSession(user, userAgent, ipAddress);
	}

	async _createSession(user, userAgent, ipAddress) {
		const jti = crypto.randomUUID();
		const issuedAt = new Date();
		const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

		const tokenHash = crypto.createHash('sha256').update(jti).digest('hex');

		await UserDAO.setActiveToken(user.rid, tokenHash, expiresAt, {
			userAgent,
			ipAddress,
			issuedAt
		});

		const token = jwt.sign(
			{ rid: user.rid, email: user.email, jti },
			JWT_SECRET,
			{ expiresIn: JWT_CONFIG.expiresIn }
		);

		const userPublic = {
			rid: user.rid,
			email: user.email,
			name: user.name
		};

		return { user: userPublic, token, expiresAt: expiresAt.getTime() };
	}

	async logout(rid, jti) {
		const tokenHash = crypto.createHash('sha256').update(jti).digest('hex');
		const isValid = await AuthQueries.verifySession(rid, tokenHash);
		
		if (isValid) {
			await UserDAO.clearActiveToken(rid);
		}
	}
}

export default new AuthCommands();