<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_APP_URL } from '$env/static/public';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: shouldContinue =
		$page.url.searchParams.get('continue') === '1' && data.currentUser && data.tenant;

	const returnToUrl = () => {
		const searchParams = $page.url.searchParams;
		const returnUrl =
			searchParams.get('return') ||
			`${searchParams.get('appOrigin') || PUBLIC_APP_URL}/${data.tenant.name}`;
		goto(returnUrl);
	};

	$: if (shouldContinue) returnToUrl();
</script>

{#if data.currentUser === undefined}
	<h1>Checking...</h1>
{:else if shouldContinue}
	<h1>Signing in...</h1>
{:else}
	<slot />
{/if}

<style>
	h1 {
		color: var(--textColorLight);
		font-family: 'Rubik', sans-serif;
		font-size: 16px;
		text-align: center;
		font-weight: 600;
		margin: 48px 0 48px 0;
	}
</style>
