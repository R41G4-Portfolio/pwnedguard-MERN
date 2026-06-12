const ResultCard = ({ result }) => {
	const { pwned, count, hashPrefix, hashSuffix } = result;
	
	const cardModifier = pwned ? 'result-card--pwned' : 'result-card--safe';
	
	return (
		<div className={`result-card ${cardModifier}`}>
			<div className="result-card__icon">
				{pwned ? '⚠️' : '✅'}
			</div>
			<div className="result-card__content">
				<h4 className="result-card__status">
					{pwned ? 'Contraseña filtrada' : 'Contraseña segura'}
				</h4>
				<p className="result-card__message">
					{pwned 
						? `Esta contraseña ha aparecido ${count} veces en filtraciones. No la uses.`
						: 'No se encontró esta contraseña en filtraciones conocidas.'
					}
				</p>
				{hashPrefix && (
					<small className="result-card__hash-info">
						Hash prefix: {hashPrefix} | Hash suffix: {hashSuffix}
					</small>
				)}
			</div>
		</div>
	);
};

export default ResultCard;