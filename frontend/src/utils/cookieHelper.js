export const getAuthMeta = () => {
	const cookies = document.cookie.split('; ');
	const metaCookie = cookies.find(row => row.startsWith('auth_meta='));
	
	if (!metaCookie) return null;
	
	try {
		const value = metaCookie.split('=')[1];
		return JSON.parse(decodeURIComponent(value));
	} catch {
		return null;
	}
};

export const checkIsAuthenticated = () => {
	const meta = getAuthMeta();
	if (!meta) return false;
	
	// Verificar expiración (exp está en segundos)
	const now = Math.floor(Date.now() / 1000);
	return meta.exp > now;
};