import { createContext, useState, useEffect } from 'react';
import { getAuthMeta, checkIsAuthenticated } from '../utils/cookieHelper';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Usar la función con otro nombre para evitar conflicto
		const authStatus = checkIsAuthenticated();
		const meta = getAuthMeta();
		
		setIsAuthenticated(authStatus);
		if (meta) {
			setUser({ name: meta.name, email: meta.email, rid: meta.rid });
		}
		setLoading(false);
	}, []);

	const login = (userData) => {
		setIsAuthenticated(true);
		setUser(userData);
	};

	const logout = () => {
		setIsAuthenticated(false);
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};