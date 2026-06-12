import UserDAO from '../repository/dao/UserDAO.js';
import UserDTO from '../repository/dto/UserDTO.js';

class UserQueries {
	async getPublicUser(rid) {
		const user = await UserDAO.findByRid(rid);
		if (!user) {
			throw new Error('Usuario no encontrado');
		}
		return UserDTO.toPublic(user);
	}

	async getUserSessionInfo(rid) {
		const user = await UserDAO.findByRid(rid);
		if (!user) {
			throw new Error('Usuario no encontrado');
		}
		return {
			user: UserDTO.toPublic(user),
			activeSessions: user.activeTokens?.length || 0
		};
	}
}

export default new UserQueries();