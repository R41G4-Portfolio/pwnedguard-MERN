import { User } from '../../models/User.js';

class UserDAO {
	async findByRid(rid, includeSensitive = false) {
		let query = User.findOne({ rid });
		if (includeSensitive) {
			query = query.select('+passwordHash +activeTokenHash +activeTokenExpiresAt +activeTokenMetadata');
		}
		return await query.lean();
	}

	async findByEmail(email, includeSensitive = false) {
		/* Quitamos el punto (.) de la validación. 
		Solo bloqueamos el '$' para mantener esta capa protectora.
		*/
		if (typeof email === 'string' && /\$/.test(email)) {
			throw new Error('Formato de email inválido');
		}
		
		let query = User.findOne({ email });
		if (includeSensitive) {
			query = query.select('+passwordHash +activeTokenHash +activeTokenExpiresAt +activeTokenMetadata');
		}
		return await query.lean();
	}

	async create(userData) {
		const user = new User(userData);
		const saved = await user.save();
		return saved.toObject();
	}

	async updateByRid(rid, updates) {
		return await User.findOneAndUpdate(
			{ rid },
			{ $set: updates },
			{ returnDocument: 'after', runValidators: true }
		);
	}

	async setActiveToken(rid, tokenHash, expiresAt, metadata) {
		return await User.findOneAndUpdate(
			{ rid },
			{
				$set: {
					activeTokenHash: tokenHash,
					activeTokenExpiresAt: expiresAt,
					activeTokenMetadata: metadata,
					lastLoginAt: new Date()
				}
			},
			{ returnDocument: 'after', runValidators: true }
		);
	}

	async clearActiveToken(rid) {
		return await User.findOneAndUpdate(
			{ rid },
			{
				$set: {
					activeTokenHash: null,
					activeTokenExpiresAt: null,
					activeTokenMetadata: { userAgent: null, ipAddress: null, issuedAt: null }
				}
			},
			{ returnDocument: 'after', runValidators: true }
		);
	}

	async verifyToken(rid, tokenHash) {
		const user = await User.findOne({ rid }).select('+activeTokenHash +activeTokenExpiresAt');
		if (!user) return false;
		
		const isValid = user.activeTokenHash === tokenHash;
		const isExpired = user.activeTokenExpiresAt && user.activeTokenExpiresAt < new Date();
		
		return isValid && !isExpired;
	}
}

export default new UserDAO();