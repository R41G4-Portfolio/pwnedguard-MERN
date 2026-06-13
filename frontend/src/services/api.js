// Al no haber archivo .env, toma '/api' por defecto de forma relativa
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Verificación de contraseñas filtradas (Pwned Passwords API)
export const checkPassword = async (password) => {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-1', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
	
	const prefix = hash.slice(0, 5);
	const suffix = hash.slice(5);

	const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
	const text = await response.text();

	// Soporta \r\n (Windows) y \n (Linux/Cloudflare) limpiamente
	const lines = text.split(/\r?\n/);
	let found = false;
	let count = 0;

	for (const line of lines) {
		if (!line.trim()) continue; // Evita romper si hay una línea vacía al final
		
		const [foundSuffix, foundCount] = line.split(':');
		// Aseguramos que ambos lados existan y comparamos el suffix limpio
		if (foundSuffix && foundSuffix.trim() === suffix) {
			found = true;
			count = parseInt(foundCount.trim(), 10);
			break;
		}
	}

	return {
		pwned: found,
		count: count,
		message: found 
			? `Esta contraseña ha sido filtrada ${count} veces`
			: 'Esta contraseña no aparece en filtraciones conocidas',
		hashPrefix: prefix,
		hashSuffix: suffix
	};
};

// Registro de usuario
export const signup = async (name, email, password) => {
	// Corregido: se eliminó '/api' duplicado de la cadena
	const response = await fetch(`${API_URL}/auth/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name, email, password }),
		credentials: 'include'
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al registrar usuario');
	}

	return await response.json();
};

// Inicio de sesión
export const signin = async (email, password) => {
	// Corregido: se eliminó '/api' duplicado de la cadena
	const response = await fetch(`${API_URL}/auth/signin`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, password }),
		credentials: 'include'
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.error || 'Error al iniciar sesión');
	}

	return await response.json();
};

// Cierre de sesión
export const logout = async () => {
	try {
		const response = await fetch(`${API_URL}/auth/logout`, {  // ← Quitar '/api' extra
			method: 'POST',
			credentials: 'include'
		});

		if (response.status === 401) {
			const error = await response.json();
			throw new Error(error.error || 'Sesión inválida');
		}

		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || 'Error al cerrar sesión');
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};