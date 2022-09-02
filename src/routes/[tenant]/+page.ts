import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const tenantRes = await fetch(`http://127.0.0.1:3000/v3/${params.tenant}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: 'query { tenant { name, displayName } }'
		})
	});
	const tenantObj = (await tenantRes.json())?.data?.tenant;

	const authRes = await fetch(`http://127.0.0.1:3000/auth`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	});

	return {
		tenant: {
			name: (tenantObj?.tenant || params.tenant) as string,
			displayName: (tenantObj?.displayName || tenantObj?.tenant || params.tenant) as string
		},
		currentUser: authRes.ok
			? await (async () => {
					const currentUser = await authRes?.json();
					return {
						_id: currentUser._id as string,
						name: currentUser.name as string,
						email: currentUser.email as string | undefined | null
					};
			  })()
			: null
	};
};
