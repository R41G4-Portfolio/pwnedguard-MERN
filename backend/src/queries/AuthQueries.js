import UserDAO from '../repository/dao/UserDAO.js';

class AuthQueries {
	async getUserByEmail(email, includeSensitive = false) {
		return await UserDAO.findByEmail(email, includeSensitive);
	}

	async getUserByRid(rid, includeSensitive = false) {
		return await UserDAO.findByRid(rid, includeSensitive);
	}

	async verifySession(rid, tokenHash) {
		return await UserDAO.verifyToken(rid, tokenHash);
	}

	async isEmailTaken(email) {
		const user = await UserDAO.findByEmail(email);
		return !!user;
	}
}

export default new AuthQueries();