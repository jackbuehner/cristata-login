<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import ErrorBox from '$components/ErrorBox.svelte';
	import Header from '$components/Header.svelte';
	import { PUBLIC_APP_URL, PUBLIC_SERVER_URL } from '$env/static/public';
	import { modifySessionCookie } from '$utils/modifySessionCookie';
	import NProgress from 'nprogress';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let hideCurrent = false;

	const token = $page.url.searchParams.get('token') || '';

	let error = '';
	let signingIn = false;

	async function magicSignIn() {
		signingIn = true;
		NProgress.start();

		const res = await fetch(
			`${PUBLIC_SERVER_URL}/auth/magiclogin/callback?tenant=${
				data.tenant.name
			}&token=${encodeURIComponent(token)}&redirect=false`,
			{
				method: 'get',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				redirect: 'manual',
				cache: 'no-cache'
			}
		);

		let json: Record<string, unknown> = await res.json();

		if (res.status === 200) {
			modifySessionCookie();
			returnToUrl();
			return;
		}

		signingIn = false;
		NProgress.done();

		if (res.status === 500 && json?.error) {
			if (typeof json.error === 'string') error = json.error + '.';
			else error = JSON.stringify(json.error);
		} else {
			error = `<b>An unexpected error occured.</b> Error text: [${res.status}] ${
				json?.error || res.statusText
			}`;
		}
	}

	const returnToUrl = () => {
		const searchParams = $page.url.searchParams;
		const returnUrl =
			searchParams.get('return') || `${data.appOrigin || PUBLIC_APP_URL}/${$page.params.tenant}`;
		goto(returnUrl);
	};
</script>

<Header
	heading="Sign{signingIn ? 'ing' : ''} in to Cristata"
	caption={error ? '' : signingIn ? 'Please wait a moment' : ''}
/>

{#if error}
	<div class="box">
		<ErrorBox html={error} />
		<Button
			style="width: 100%; height: 40px; margin-top: 20px;"
			on:click={magicSignIn}
			disabled={signingIn}
		>
			Try again
		</Button>
		<Button
			style="width: 100%; height: 40px; margin-top: 20px;"
			href="/{data.tenant.name}/sign-in/magic-link?return={encodeURIComponent(
				$page.url.searchParams.get('return') || ''
			)}"
		>
			Get a new magic link
		</Button>
	</div>
{:else}
	<div class="box">
		<Button
			style="width: 100%; height: 40px; margin-top: 20px;"
			on:click={magicSignIn}
			disabled={signingIn}
		>
			Confirm sign in
		</Button>
	</div>
{/if}

<style>
	div.box {
		max-width: 400px;
		margin: 40px auto 50px auto;
	}
</style>
