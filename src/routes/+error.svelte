<script>
	import { page } from '$app/stores';
	import Header from '$components/Header.svelte';

	let message = $page.error.cause.message;
	console.log(message);
</script>

<Header heading="Something went wrong" caption={$page.error.message || $page.error.cause.message} />

<div>:(</div>

<pre>{$page.error.cause.message}</pre>

<style>
	pre {
		color: var(--textColorLighter);
		font-family: 'Rubik', sans-serif;
		font-size: 16px;
		font-weight: 400;
		margin: 16px 16px 48px 16px;
		text-align: center;
		white-space: pre-wrap;
	}
	div {
		color: var(--textColorLighter);
		font-family: sans-serif;
		font-size: 36px;
		font-weight: 600;
		margin: 16px 16px 48px 16px;
		text-align: center;
	}
</style>
