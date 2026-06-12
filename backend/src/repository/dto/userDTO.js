class UserDTO {
	static toPublic(user) {
		if (!user) return null;
		return {
			rid: user.rid,
			email: user.email,
			name: user.name
		};
	}

	static sanitize(user) {
		if (!user) return null;
		const { _id, __v, passwordHash, activeTokenHash, activeTokenExpiresAt, activeTokenMetadata, createdAt, lastLoginAt, isActive, ...clean } = user;
		return clean;
	}
}

export default UserDTO;