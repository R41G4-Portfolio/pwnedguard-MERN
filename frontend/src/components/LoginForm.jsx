import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signin } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { loginSchema } from '../schemas/authSchemas';

const LoginForm = () => {
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [serverError, setServerError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Verificar si el formulario es válido para habilitar el botón
	const isFormValid = () => {
		return email.trim() !== '' && 
		       password.trim() !== '' && 
		       emailError === '' && 
		       passwordError === '';
	};

	const handleEmailChange = (e) => {
		const value = e.target.value;
		setEmail(value);
		const result = loginSchema.safeParse({ email: value, password });
		if (!result.success) {
			const flattened = result.error.flatten();
			setEmailError(flattened.fieldErrors?.email?.[0] || '');
		} else {
			setEmailError('');
		}
	};

	const handlePasswordChange = (e) => {
		const value = e.target.value;
		setPassword(value);
		const result = loginSchema.safeParse({ email, password: value });
		if (!result.success) {
			const flattened = result.error.flatten();
			setPasswordError(flattened.fieldErrors?.password?.[0] || '');
		} else {
			setPasswordError('');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setServerError('');

		const validation = loginSchema.safeParse({ email, password });
		if (!validation.success) {
			setServerError('Por favor, corrige los errores en el formulario');
			return;
		}

		setIsLoading(true);

		try {
			const user = await signin(email, password);
			login(user);
			navigate('/dashboard');
		} catch (err) {
			setServerError(err.message || 'Error al iniciar sesión');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className="login-form" onSubmit={handleSubmit} noValidate>
			<h2 className="login-form__title">Iniciar sesión</h2>

			<div className="login-form__field form-group">
				<label htmlFor="email" className="form-label">Correo electrónico</label>
				<input
					id="email"
					type="email"
					className={`form-input ${emailError ? 'form-input--error' : ''}`}
					value={email}
					onChange={handleEmailChange}
					disabled={isLoading}
					placeholder="tu@email.com"
				/>
				{emailError && <div className="form-error">{emailError}</div>}
			</div>

			<div className="login-form__field form-group">
				<label htmlFor="password" className="form-label">Contraseña</label>
				<input
					id="password"
					type="password"
					className={`form-input ${passwordError ? 'form-input--error' : ''}`}
					value={password}
					onChange={handlePasswordChange}
					disabled={isLoading}
					placeholder="••••••••"
				/>
				{passwordError && <div className="form-error">{passwordError}</div>}
			</div>

			{serverError && <div className="form-error text-center mb-3">{serverError}</div>}

			<button 
				type="submit" 
				className="btn btn--primary btn--full-width" 
				disabled={!isFormValid() || isLoading}
			>
				{isLoading ? 'Ingresando...' : 'Ingresar'}
			</button>

			<div className="login-form__footer">
				<span className="login-form__footer-text">¿No tienes cuenta?</span>
				<Link to="/register" className="btn btn--secondary btn--full-width">
					Regístrate
				</Link>
			</div>
		</form>
	);
};

export default LoginForm;