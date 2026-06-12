import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="footer">
			<div className="container">
				<p className="footer__text">PwnedGuard - Verificador de contraseñas filtradas</p>
				<div className="footer__links">
					<a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="footer__link">
						Have I Been Pwned
					</a>
					<Link to="/privacidad" className="footer__link">Privacidad</Link>
					<Link to="/terminos" className="footer__link">Términos</Link>
				</div>
			</div>
		</footer>
	);
};

export default Footer;