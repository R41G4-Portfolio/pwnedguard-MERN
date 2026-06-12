import Header from '../components/Header';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
	return (
		<div className="layout">
			<Header />
			<main className="layout__main">
				{children}
			</main>
			<Footer />
		</div>
	);
};

export default MainLayout;