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
	import type { PageData } from './$types';

	export let data: PageData;

	let hideCurrent = false;

	let email: string;

	let error = '';

	const handleSubmit = async (evt: SubmitEvent) => {
		evt.preventDefault();
		NProgress.start();

		const res = await fetch(`${PUBLIC_SERVER_URL}/auth/magiclogin?tenant=${data.tenant.name}`, {
			method: 'post',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				destination: email,
				redirect: false,
				returnUrl: $page.url.searchParams.get('return') || ''
			}),
			redirect: 'follow',
			cache: 'no-cache'
		});

		let json: Record<string, unknown> | undefined = undefined;
		if (res.status === 200) {
			json = await res.json();
		} else {
			const text = await res.text();
			if (text === 'Please specify the destination.') {
				json = { success: false, error: 'You need to specify an email address.', expected: true };
			} else {
				json = { success: false, error: text };
			}
		}

		if (res.status === 200 && json?.success) {
			// email sent
			goto(`/${data.tenant.name}/sign-in/magic-link/sent?email=${encodeURIComponent(email)}`);
			return;
		}

		NProgress.done();

		if (res.status === 200 && json?.error) {
			if (typeof json.error === 'string') error = json.error + '.';
			error = JSON.stringify(json.error) + '.';
		} else if (json?.error && typeof json.error === 'string' && json?.expected) {
			error = json.error;
		} else {
			error = `<b>An unexpected error occured.</b> Error text: [${res.status}] ${
				json?.error || res.statusText
			}`;
		}
	};

	const returnToUrl = () => {
		const searchParams = $page.url.searchParams;
		const returnUrl =
			searchParams.get('return') || `${data.appOrigin || PUBLIC_APP_URL}/${$page.params.tenant}`;
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

<Form {handleSubmit} submitText={'Email me a magic link'}>
	<TextInput
		bind:value={email}
		label="Email address"
		placeholder="Your email"
		autocomplete="email"
	/>
</Form>

<div class="or">
	<div>OR</div>
	<Button
		style="width: 100%; height: 40px;"
		href="/{data.tenant.name}?return={encodeURIComponent(
			$page.url.searchParams.get('return') || ''
		)}"
	>
		Use a username and password
	</Button>
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
