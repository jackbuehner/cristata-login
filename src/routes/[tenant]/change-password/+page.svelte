<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import ErrorBox from '$components/ErrorBox.svelte';
	import Form from '$components/Form.svelte';
	import Header from '$components/Header.svelte';
	import TextInput from '$components/TextInput.svelte';
	import NProgress from 'nprogress';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let oldPassword: string;
	let newPassword: string;
	let confirmNewPassword: string;

	onMount(() => {
		const searchParams = $page.url.searchParams;
		if (searchParams.has('pe')) {
			oldPassword = atob(searchParams.get('pe') || '');
			searchParams.delete('pe');
			history.replaceState({}, '', `/${$page.params.tenant}?${searchParams}`);
		}
	});

	let error = '';

	onMount(() => {
		if (!data.currentUser) goto(`/${$page.params.tenant}/?${$page.url.searchParams}`);
	});

	const handleSubmit = async (evt: SubmitEvent) => {
		evt.preventDefault();

		if (!oldPassword) {
			error = 'You need to type your existing password.';
			return;
		}

		if (!newPassword) {
			error = 'You need to type a new password.';
			return;
		}

		if (!confirmNewPassword) {
			error = 'You need to confirm your new password.';
			return;
		}

		if (newPassword !== confirmNewPassword) {
			error = 'The new passwords do not match.';
			return;
		}

		NProgress.start();

		// prettier-ignore
		const escapedOldPassword = oldPassword.replace(/"/g, "\\\"");
		// prettier-ignore
		const escapedNewPassword = newPassword.replace(/"/g, "\\\"");

		const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/v3/${$page.params.tenant}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: `mutation __Silent_ChangePassword { userPasswordChange(oldPassword: "${escapedOldPassword}", newPassword: "${escapedNewPassword}") { _id } }`
			})
		});

		if (!res.ok) {
			try {
				const { errors } = await res.json();
				const errorCode = errors[0].extensions.code.replace('GRAPHQL_', '');
				const reason = errors[0].message.split(':')[0];
				error = `<b>An unexpected error occured.</b> Error text: [${errorCode}] ${reason}`;
			} catch (e) {
				// unknown server error
				error = `<b>An unexpected error occured.</b> Error text: [${res.status}] ${res.statusText}`;
				NProgress.done();
			}
			return;
		}

		const json:
			| { data: { userPasswordChange: { _id: string } }; errors: Record<string, unknown>[] }
			| undefined = await res.json();

		if (json?.data?.userPasswordChange) {
			// password change successful; sign out
			goto(`/${$page.params.tenant}/sign-out?${$page.url.searchParams}`);
		} else if (
			json?.errors &&
			Array.isArray(json.errors) &&
			typeof json.errors[0].message === 'string'
		) {
			// error changing password
			if (json.errors[0].message === 'Password or username is incorrect') {
				error = 'Incorrect current passsword';
			} else {
				error = json.errors[0].message;
			}
		} else {
			// unknown server error
			error = `<b>An unexpected error occured.</b> Error text: [${res.status}] ${res.statusText}`;
		}

		NProgress.done();
	};
</script>

<Header
	heading="Change your password"
	caption="{data.currentUser?.name} ({data.currentUser?.email})"
/>

{#if error}
	<ErrorBox html={error} />
{/if}

<Form {handleSubmit} submitText={'Change password'}>
	<TextInput
		bind:value={oldPassword}
		label="Current password"
		placeholder="Your current password"
		password
		autocomplete="current-password"
	/>
	<TextInput
		bind:value={newPassword}
		label="New Password"
		placeholder="Your new password"
		password
		autocomplete="new-password"
	/>
	<TextInput
		bind:value={confirmNewPassword}
		label="Confirm new password"
		placeholder="Your new password (again)"
		password
		autocomplete="new-password"
	/>
</Form>
