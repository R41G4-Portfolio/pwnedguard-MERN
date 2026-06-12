import { Helmet } from 'react-helmet-async';
import { buildHelmetData } from '../services/metaService';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
	const helmetData = buildHelmetData('login');
	useDocumentTitle(helmetData.title);

	return (
		<>
			<Helmet>
				<title>{helmetData.title}</title>
				{helmetData.meta.map((tag, index) => (
					<meta key={index} name={tag.name} content={tag.content} />
				))}
			</Helmet>
			<div className="page page--login">
				<LoginForm />
			</div>
		</>
	);
};

export default LoginPage;