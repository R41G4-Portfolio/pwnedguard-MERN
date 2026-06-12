export const generatePageMeta = (pageName, customData = {}) => {
	const baseTitle = 'PwnedGuard';
	const baseDescription = 'Verifica si tus contraseñas han sido filtradas en brechas de seguridad';
	const baseKeywords = 'seguridad, contraseñas, filtradas, HIBP, pwned, verificador';

	const pages = {
		home: {
			title: `${baseTitle} - Protege tus contraseñas`,
			description: baseDescription,
			keywords: `${baseKeywords}, inicio`
		},
		dashboard: {
			title: `${baseTitle} - Tu dashboard de seguridad`,
			description: 'Revisa y verifica la seguridad de tus contraseñas',
			keywords: `${baseKeywords}, dashboard, verificación`
		}
	};

	const selectedPage = pages[pageName] || pages.home;

	return {
		title: customData.title || selectedPage.title,
		description: customData.description || selectedPage.description,
		keywords: customData.keywords || selectedPage.keywords
	};
};

export const getPageTitle = (pageName, customTitle = null) => {
	if (customTitle) return customTitle;
	const meta = generatePageMeta(pageName);
	return meta.title;
};