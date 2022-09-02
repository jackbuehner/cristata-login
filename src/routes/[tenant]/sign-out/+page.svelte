<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Header from '$components/Header.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		fetch(`http://127.0.0.1:3000/auth/clear`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			cache: 'no-cache'
		}).finally(() => {
			goto(`/${$page.params.tenant}`);
		});
	});
</script>

<Header heading="Signing out of Cristata" caption="Please wait a moment" />
