/*
import { Helmet } from 'react-helmet-async';
import { buildHelmetData } from '../services/metaService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import PasswordChecker from '../components/PasswordChecker';

const HomePage = () => {
	const helmetData = buildHelmetData('home');
	useDocumentTitle(helmetData.title);

	return (
		<>
			<Helmet>
				<title>{helmetData.title}</title>
				{helmetData.meta.map((tag, index) => (
					<meta key={index} name={tag.name} content={tag.content} />
				))}
			</Helmet>

			<div className="container">
				<div className="home-page__hero text-center mt-5 mb-5">
					<h1 className="home-page__title">PwnedGuard</h1>
					<p className="home-page__subtitle text-muted">Verifica si tus contraseñas han sido filtradas en brechas de seguridad</p>
				</div>
				<PasswordChecker />
			</div>
		</>
	);
};

export default HomePage;
*/
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { buildHelmetData } from '../services/metaService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const HomePage = () => {
	const helmetData = buildHelmetData('home');
	useDocumentTitle(helmetData.title);

	return (
		<>
			<Helmet>
				<title>{helmetData.title}</title>
				{helmetData.meta.map((tag, index) => (
					<meta key={index} name={tag.name} content={tag.content} />
				))}
			</Helmet>

			<div className="page page--home">
				<div className="container">
					<div className="home-page__hero text-center mt-5 mb-5">
						<h1 className="home-page__title">PwnedGuard</h1>
						<p className="home-page__subtitle text-muted">
							Protege tus cuentas verificando si tus contraseñas han sido filtradas en brechas de seguridad
						</p>
						<Link to="/register" className="btn btn--primary mt-4">
							Comenzar ahora
						</Link>
					</div>

					<div className="home-page__features">
						<h2 className="text-center mb-4">¿Cómo funciona?</h2>
						<div className="features-grid">
							<div className="card">
								<h3>Privacidad primero</h3>
								<p>Tu contraseña nunca se envía completa. Usamos k-anonymity de HIBP.</p>
							</div>
							<div className="card">
								<h3>Seguridad real</h3>
								<p>Consulta la base de datos de Have I Been Pwned con más de 10B filtraciones.</p>
							</div>
							<div className="card">
								<h3>Sin almacenamiento</h3>
								<p>No guardamos tus contraseñas ni resultados de verificación.</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default HomePage;