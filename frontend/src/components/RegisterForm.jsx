import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import { AuthContext } from '../contexts/AuthContext';
import { signupSchema } from '../schemas/authSchemas';

const RegisterForm = () => {
	const navigate = useNavigate();
	const { login } = useContext(AuthContext);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [serverError, setServerError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// Verificar si el formulario es válido para habilitar el botón
	const isFormValid = () => {
		return name.trim() !== '' && 
		       email.trim() !== '' && 
		       password.trim() !== '' && 
		       nameError === '' && 
		       emailError === '' && 
		       passwordError === '';
	};

	const handleNameChange = (e) => {
		const value = e.target.value;
		setName(value);
		const result = signupSchema.safeParse({ name: value, email, password });
		if (!result.success) {
			const flattened = result.error.flatten();
			setNameError(flattened.fieldErrors?.name?.[0] || '');
		} else {
			setNameError('');
		}
	};

	const handleEmailChange = (e) => {
		const value = e.target.value;
		setEmail(value);
		const result = signupSchema.safeParse({ name, email: value, password });
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
		const result = signupSchema.safeParse({ name, email, password: value });
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

		const validation = signupSchema.safeParse({ name, email, password });
		if (!validation.success) {
			setServerError('Por favor, corrige los errores en el formulario');
			return;
		}

		setIsLoading(true);

		try {
			const user = await signup(name, email, password);
			login(user);
			navigate('/dashboard');
		} catch (err) {
			setServerError(err.message || 'Error al registrar usuario');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<form className="register-form" onSubmit={handleSubmit} noValidate>
			<h2 className="register-form__title">Crear cuenta</h2>

			<div className="register-form__field form-group">
				<label htmlFor="name" className="form-label">Nombre</label>
				<input
					id="name"
					type="text"
					className={`form-input ${nameError ? 'form-input--error' : ''}`}
					value={name}
					onChange={handleNameChange}
					disabled={isLoading}
					placeholder="Tu nombre"
				/>
				{nameError && <div className="form-error">{nameError}</div>}
			</div>

			<div className="register-form__field form-group">
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

			<div className="register-form__field form-group">
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
				{isLoading ? 'Registrando...' : 'Registrarse'}
			</button>

			<div className="register-form__footer">
				<span className="register-form__footer-text">¿Ya tienes cuenta?</span>
				<Link to="/login" className="btn btn--secondary btn--full-width">
					Iniciar sesión
				</Link>
			</div>
		</form>
	);
};

export default RegisterForm;