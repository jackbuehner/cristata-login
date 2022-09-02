<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$components/Header.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/clear`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			cache: 'no-cache'
		}).finally(() => {
			goto(`/${$page.params.tenant}/?${$page.url.searchParams}`);
		});
	});
</script>

<Header heading="Signing out of Cristata" caption="Please wait a moment" />
