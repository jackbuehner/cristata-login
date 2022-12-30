<script lang="ts">
	import { page } from '$app/stores';
	import Header from '$components/Header.svelte';
	import { PUBLIC_SERVER_URL } from '$env/static/public';
	import { onMount } from 'svelte';

	onMount(() => {
		fetch(`${PUBLIC_SERVER_URL}/auth/clear`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			cache: 'no-cache'
		}).finally(() => {
			window.location.href = `/${$page.params.tenant}/?${$page.url.searchParams}`;
		});
	});
</script>

<Header heading="Signing out of Cristata" caption="Please wait a moment" />
