import { useEffect } from 'react';

export const useDocumentTitle = (title, options = { preserveOnUnmount: false }) => {
	useEffect(() => {
		const originalTitle = document.title;
		document.title = title;

		return () => {
			if (!options.preserveOnUnmount) {
				document.title = originalTitle;
			}
		};
	}, [title, options.preserveOnUnmount]);
};