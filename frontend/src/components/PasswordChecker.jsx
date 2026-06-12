import { useState } from 'react';
import { checkPassword } from '../services/api';
import ResultCard from './ResultCard';
import Spinner from './Spinner';

const PasswordChecker = () => {
	const [password, setPassword] = useState('');
	const [isChecking, setIsChecking] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!password) return;

		setIsChecking(true);
		setError(null);
		setResult(null);

		try {
			const data = await checkPassword(password);
			setResult(data);
		} catch (err) {
			setError('Error al verificar la contraseña');
		} finally {
			setIsChecking(false);
		}
	};

	return (
		<div className="password-checker card">
			<h3 className="password-checker__title">Verificar contraseña</h3>
			<p className="password-checker__description">
				Ingresa una contraseña para verificar si ha sido filtrada
			</p>

			<form onSubmit={handleSubmit} className="password-checker__form">
				<div className="password-checker__field">
					<input
						type="password"
						className="form-input"
						placeholder="Ingresa tu contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						disabled={isChecking}
					/>
				</div>
				<button type="submit" className="btn btn--primary" disabled={isChecking}>
					{isChecking ? <Spinner /> : 'Verificar'}
				</button>
			</form>

			{error && (
				<div className="password-checker__error text-danger text-center mt-3">
					{error}
				</div>
			)}

			{result && <ResultCard result={result} />}

			<p className="password-checker__info text-muted text-center mt-3">
				Tu contraseña nunca se envía completa. Solo se envía un hash parcial (k-anonymity)
			</p>
		</div>
	);
};

export default PasswordChecker;