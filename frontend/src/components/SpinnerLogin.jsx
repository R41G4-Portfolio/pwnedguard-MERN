const SpinnerLogin = () => {
	return (
		<div className="spinner-login">
			<div className="spinner-login__overlay"></div>
			<div className="spinner-login__container">
				<div className="spinner-login__spinner"></div>
				<p className="spinner-login__text">Cargando...</p>
			</div>
		</div>
	);
};

export default SpinnerLogin;