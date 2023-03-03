import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	const appOrigin = url.searchParams.get('appOrigin');
	const isFromTauri = appOrigin === 'https://tauri.localhost';

	return { appOrigin, isFromTauri };
};
