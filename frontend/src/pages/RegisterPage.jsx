import { Helmet } from 'react-helmet-async';
import { buildHelmetData } from '../services/metaService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
	const helmetData = buildHelmetData('register');
	useDocumentTitle(helmetData.title);

	return (
		<>
			<Helmet>
				<title>{helmetData.title}</title>
				{helmetData.meta.map((tag, index) => (
					<meta key={index} name={tag.name} content={tag.content} />
				))}
			</Helmet>
			<div className="page page--register">
				<RegisterForm />
			</div>
		</>
	);
};

export default RegisterPage;