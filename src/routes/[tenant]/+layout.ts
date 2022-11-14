import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	const tenantRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v3/${params.tenant}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: 'query { tenant { name, displayName } }'
		})
	});
	const tenantObj = (await tenantRes.json())?.data?.tenant;

	let isResolved = false;
	const [, currentUser]: [Response, null | Record<string, unknown>] = await fetch(
		`${import.meta.env.VITE_API_BASE_URL}/auth`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}
	).then(async (res) => {
		if (res.ok) {
			const currentUser = await res.json();
			if (browser) isResolved = true;

			if (currentUser.tenant === params.tenant) return [res, currentUser];
			return [res, null];
		} else {
			if (browser) isResolved = true;
			return [res, null];
		}
	});

	return {
		tenant: {
			name: (tenantObj?.tenant || params.tenant) as string,
			displayName: (tenantObj?.displayName || tenantObj?.tenant || params.tenant) as string
		},
		/**
		 * If user found: `{ _id: string, name: string, email: string }`;
		 *
		 * If no found user: `null`;
		 *
		 * If still loading: `undefined`;
		 */
		currentUser: isResolved
			? currentUser
				? {
						_id: currentUser._id as string,
						name: currentUser.name as string,
						email: currentUser.email as string | undefined | null
				  }
				: null
			: undefined
	};
};
