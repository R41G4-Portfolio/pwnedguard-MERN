import { generatePageMeta } from '../utils/metaHelpers';

export const buildHelmetData = (pageName, customData = {}) => {
	const meta = generatePageMeta(pageName, customData);

	return {
		title: meta.title,
		meta: [
			{ name: 'description', content: meta.description },
			{ name: 'keywords', content: meta.keywords },
			{ name: 'author', content: 'PwnedGuard' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
			{ property: 'og:title', content: meta.title },
			{ property: 'og:description', content: meta.description },
			{ property: 'og:type', content: 'website' },
			{ name: 'twitter:card', content: 'summary' },
			{ name: 'twitter:title', content: meta.title },
			{ name: 'twitter:description', content: meta.description }
		],
		link: [
			{ rel: 'canonical', href: window.location.href },
			{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
		]
	};
};