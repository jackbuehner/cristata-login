<script lang="ts">
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

{#if data.currentUser === undefined}
	<h1>Checking...</h1>
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
