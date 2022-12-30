<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ErrorBox from '$components/ErrorBox.svelte';
	import Header from '$components/Header.svelte';
	import { PUBLIC_APP_URL, PUBLIC_SERVER_URL } from '$env/static/public';
	import NProgress from 'nprogress';
	import type { PageData } from './$types';

	export let data: PageData;

	let hideCurrent = false;

	const email = $page.url.searchParams.get('email');

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
				redirect: false
			}),
			redirect: 'follow',
			cache: 'no-cache'
		});

		let json: Record<string, unknown> | undefined = undefined;
		if (res.status === 200) {
			json = await res.json();
		} else {
			const text = await res.text();
			console.log(text);
			if (text === 'Please specify the destination.') {
				json = { success: false, error: 'You need to specify an email address.', expected: true };
			} else {
				json = { success: false, error: text };
			}
		}

		if (res.status === 200 && json?.success) {
			// email sent
			goto(`/${data.tenant.name}/sign-in/magic-link/sent`);
			return;
		}

		NProgress.done();

		if (res.status === 200 && json?.error) {
			error = json.error + '.';
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
		const returnUrl = searchParams.get('return') || `${PUBLIC_APP_URL}/${$page.params.tenant}`;
		goto(returnUrl);
	};
</script>

<Header heading="An email is on the way" caption="For {data.tenant.displayName}" />

{#if error}
	<ErrorBox html={error} />
{/if}

<div class="message">
	<p>
		We sent an email to <strong>{email}</strong>
	</p>
	<p>
		In the email, you will find a magic link that will automatically sign you in to {data.tenant
			.displayName}'s Cristata instance
	</p>
	<p>The link expires in 60 minutes, so be sure to use it soon.</p>
</div>

<div class="alt">
	<div>
		Looking for a different organization?
		<a href="/">Switch instance</a>
	</div>
</div>

<style>
	div.alt {
		max-width: 400px;
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 14px;
		line-height: 1.4;
		color: var(--textColorLight);
		margin: 40px auto;
		text-align: center;
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

	div.message {
		max-width: 400px;
		margin: 40px auto 60px auto;
	}
	p {
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 15px;
		line-height: 1.4;
		color: var(--textColorLight);
		text-align: center;
		margin: 20px;
	}
</style>
