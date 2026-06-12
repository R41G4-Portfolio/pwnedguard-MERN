import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SpinnerLogin from './components/SpinnerLogin';
import { HomePage, DashboardPage, LoginPage, RegisterPage } from './pages';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, loading } = useContext(AuthContext);
	
	if (loading) {
		return <SpinnerLogin />;
	}
	
	return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
	const { isAuthenticated, loading } = useContext(AuthContext);
	
	if (loading) {
		return <SpinnerLogin />;
	}
	
	return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const App = () => {
	const { loading } = useContext(AuthContext);
	const location = useLocation();
	
	// Ocultar header en login y register
	const hideHeader = location.pathname === '/login' || location.pathname === '/register';

	if (loading)
		return <SpinnerLogin />;

	return (
		<div className="app">
			{!hideHeader && <Header />}
			<main className="app__main">
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/login" element={
						<PublicRoute>
							<LoginPage />
						</PublicRoute>
					} />
					<Route path="/register" element={
						<PublicRoute>
							<RegisterPage />
						</PublicRoute>
					} />
					<Route path="/dashboard" element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					} />
				</Routes>
			</main>
			{!hideHeader && <Footer />}
		</div>
	);
};

export default App;