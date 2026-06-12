import { useContext, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { buildHelmetData } from '../services/metaService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { AuthContext } from '../contexts/AuthContext';
import PasswordChecker from '../components/PasswordChecker';
import Modal from '../components/Modal';

const DashboardPage = () => {
	const helmetData = buildHelmetData('dashboard');
	useDocumentTitle(helmetData.title);
	
	const { user } = useContext(AuthContext);
	
	const [showLogoutAllModal, setShowLogoutAllModal] = useState(false);

	const handleLogoutAll = () => {
		console.log('Cerrar en todos dispositivos');
		setShowLogoutAllModal(false);
	};

	return (
		<>
			<Helmet>
				<title>{helmetData.title}</title>
				{helmetData.meta.map((tag, index) => (
					<meta key={index} name={tag.name} content={tag.content} />
				))}
			</Helmet>

			<div className="page page--dashboard">
				<div className="container">
					<div className="dashboard-page__header text-center mt-4 mb-4">
						<h1 className="dashboard-page__title">Dashboard</h1>
						<p className="dashboard-page__name">Bienvenido, <strong>{user?.name || 'Usuario'}</strong></p>
						<p className="dashboard-page__email text-muted">{user?.email || 'usuario@ejemplo.com'}</p>
					</div>
					
					<PasswordChecker />
				</div>
			</div>

			<Modal
				isOpen={showLogoutAllModal}
				onClose={() => setShowLogoutAllModal(false)}
				title="Cerrar sesión en todos los dispositivos"
				message="Esta acción cerrará tu sesión en todos los dispositivos donde estés conectado. ¿Estás seguro?"
				onConfirm={handleLogoutAll}
				confirmText="Sí, cerrar todos"
				cancelText="Cancelar"
			/>
		</>
	);
};

export default DashboardPage;