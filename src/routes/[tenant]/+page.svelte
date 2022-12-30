<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/Button.svelte';
	import ErrorBox from '$components/ErrorBox.svelte';
	import Form from '$components/Form.svelte';
	import Header from '$components/Header.svelte';
	import TextInput from '$components/TextInput.svelte';
	import { PUBLIC_APP_URL, PUBLIC_SERVER_URL } from '$env/static/public';
	import NProgress from 'nprogress';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let hideCurrent = false;

	let username: string;
	let password: string;

	onMount(() => {
		const searchParams = $page.url.searchParams;
		if (searchParams.has('ue')) {
			username = atob(searchParams.get('ue') || '');
			searchParams.delete('ue');
			history.replaceState({}, '', `/${data.tenant.name}?${searchParams}`);
		}
		if (searchParams.has('pe')) {
			password = atob(searchParams.get('pe') || '');
			searchParams.delete('pe');
			history.replaceState({}, '', `/${data.tenant.name}?${searchParams}`);
		}
	});

	let error = '';

	const handleSubmit = async (evt: SubmitEvent) => {
		evt.preventDefault();
		NProgress.start();

		const res = await fetch(`${PUBLIC_SERVER_URL}/auth/local?tenant=${data.tenant.name}`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				password,
				redirect: false
			}),
			redirect: 'follow',
			cache: 'no-cache'
		});

		const json: (Record<string, unknown> & { data: Record<string, unknown> }) | undefined =
			await res.json();

		if (res.status === 200) {
			if (json?.data?.next_step === 'change_password') {
				// need to change password
				const searchParams = $page.url.searchParams;
				searchParams.set('pe', btoa(password));
				goto(`/${data.tenant.name}/change-password/?${searchParams}`);
			} else {
				// sign in successful; return to app
				returnToUrl();
			}
			return;
		}

		NProgress.done();

		if (res.status === 401) {
			error = 'The provided username or password were incorrect.';
		} else if (res.status === 429) {
			error = 'You have tried to sign in too many times. Please wait before trying again.';
		} else if (json?.error === 'Missing credentials') {
			error = 'You need to provide a username and password.';
		} else {
			error = `<b>An unexpected error occured.</b> Error text: [${res.status}] ${
				json?.error || res.statusText
			}`;
		}
	};

	const returnToUrl = () => {
		const searchParams = $page.url.searchParams;
		const returnUrl = searchParams.get('return') || `${PUBLIC_APP_URL}/${$page.params.tenant}`;
		goto(returnUrl);
	};
</script>

<Header heading="Sign in to {data.tenant.displayName}" caption="cristata.app/{data.tenant.name}" />

{#if error}
	<ErrorBox html={error} />
{/if}

{#if data.currentUser && !hideCurrent}
	<div class="note">
		<div>{data.currentUser.name} is already signed in. Continue with this account?</div>
		<div style="display: flex; gap: 6px;">
			<Button on:click={returnToUrl}>Yes</Button>
			<Button on:click={() => (hideCurrent = true)}>No</Button>
		</div>
	</div>
{/if}

<Form {handleSubmit} submitText={'Sign in'}>
	<TextInput
		bind:value={username}
		label="Username"
		placeholder="Your username or slug"
		autocomplete="username"
	/>
	<TextInput
		bind:value={password}
		label="Password"
		placeholder="Your password"
		password
		autocomplete="current-password"
	/>
</Form>

<div class="or">
	<div>OR</div>
	<Button
		href="{data.tenant.name}/sign-in/magic-link?return={encodeURIComponent(
			$page.url.searchParams.get('return') || ''
		)}"
		style="width: 100%; height: 40px;">Email me a sign-in link</Button
	>
</div>

<div class="alt">
	<div>
		Looking for a different organization?
		<a href="/">Switch instance</a>
	</div>
</div>

<style>
	div.note {
		max-width: 500px;
		width: fit-content;
		margin: 0 auto;
		margin-top: 24px;
		border: 1px solid hsl(253deg 49% 80%);
		border-radius: 3px;
		background-color: hsla(253deg 49% 80% / 10%);
		color: var(--textColorLight);
		padding: 16px;
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 15px;
		line-height: 1.4;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	div.alt {
		max-width: 400px;
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 14px;
		line-height: 1.4;
		color: var(--textColorLight);
		margin: 40px auto;
	}
	div.alt a {
		color: var(--primary-alt);
		box-shadow: 0 1px 0 0 var(--primary-alt);
		text-decoration: none;
		transition: background-color 0.2s, box-shadow 0.1s, color 0.2s;
	}
	div.alt a:hover {
		color: var(--primary-alt);
		background-color: hsla(253deg 49% 80% / 10%);
		box-shadow: 0 2px 0 0 var(--primary-alt);
		text-decoration: none;
	}

	div.or {
		max-width: 400px;
		margin: -20px auto 40px auto;
	}
	div.or > div:first-of-type {
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 16px;
		line-height: 1.4;
		color: var(--textColorLight);
		text-align: center;
		margin: 20px;
	}
</style>
