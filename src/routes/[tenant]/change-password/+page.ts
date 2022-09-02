import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const authRes = await fetch(`http://127.0.0.1:3000/auth`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});

	const currentUser = authRes.ok
		? await (async () => {
				const currentUser = await authRes?.json();
				return {
					_id: currentUser._id as string,
					name: currentUser.name as string,
					email: currentUser.email as string | undefined | null
				};
		  })()
		: null;

	return { currentUser };
};
