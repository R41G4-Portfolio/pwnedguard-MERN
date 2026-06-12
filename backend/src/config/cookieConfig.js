import { COOKIE_CONFIG } from './constants.js';

export const setAuthCookies = (res, token, user) => {
	const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
	const expiryTimestamp = Math.floor(expires.getTime() / 1000);

	// Cookie httpOnly con el token JWT
	res.cookie('auth_token', token, {
		...COOKIE_CONFIG,
		expires
	});

	// Cookie legible con datos del usuario
	res.cookie('auth_meta', JSON.stringify({
		name: user.name,
		email: user.email,
		rid: user.rid,
		exp: expiryTimestamp
	}), {
		...COOKIE_CONFIG,
		httpOnly: false,
		expires
	});
};

export const clearAuthCookies = (res) => {
	res.clearCookie('auth_token', COOKIE_CONFIG);
	res.clearCookie('auth_meta', { ...COOKIE_CONFIG, httpOnly: false });
};