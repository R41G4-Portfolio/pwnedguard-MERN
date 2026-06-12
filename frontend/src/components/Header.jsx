import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { logout } from '../services/api';

const Header = () => {
	const navigate = useNavigate();
	const { isAuthenticated, user, logout: logoutContext } = useContext(AuthContext);

	const handleLogout = async () => {
		try {
			await logout();
			logoutContext();
			navigate('/');
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
		}
	};

	return (
		<header className="header">
			<Link to="/" className="header__logo">
				PwnedGuard
			</Link>
			<nav className="header__nav">
				{!isAuthenticated ? (
					<Link to="/login" className="btn btn--primary">
						Iniciar sesión
					</Link>
				) : (
					<div className="header__user-info">
						<span className="header__user-email">{user?.email}</span>
						<button onClick={handleLogout} className="btn btn--danger">
							Cerrar sesión
						</button>
					</div>
				)}
			</nav>
		</header>
	);
};

export default Header;