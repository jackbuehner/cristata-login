import { browser } from '$app/environment';
import { PUBLIC_SERVER_URL } from '$env/static/public';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ params }) => {
	const tenantRes = await fetch(`${PUBLIC_SERVER_URL}/v3/${params.tenant}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: 'query { tenant { name, displayName } }'
		})
	});

	const tenantObj = await (async (): Promise<{ name: string; displayName: string }> => {
		if (tenantRes.ok) {
			const data = (await tenantRes.json())?.data?.tenant;
			return { name: data.name, displayName: data.displayName || data.tenant };
		}
		if (tenantRes.status === 402) {
			return { name: params.tenant, displayName: params.tenant + ' (unpaid)' };
		}
		throw redirect(307, '/');
	})();

	let isResolved = false;
	const [, currentUser]: [Response, null | Record<string, unknown>] = await fetch(
		`${PUBLIC_SERVER_URL}/auth`,
		{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		}
	).then(async (res) => {
		if (res.ok) {
			try {
				const currentUser = await res.json();
				if (browser) isResolved = true;

				if (currentUser.tenant === params.tenant) return [res, currentUser];
				return [res, null];
			} catch (error) {
				return [res, null];
			}
		} else {
			if (browser) isResolved = true;
			return [res, null];
		}
	});

	return {
		tenant: {
			name: tenantObj.name,
			displayName: tenantObj.displayName
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
