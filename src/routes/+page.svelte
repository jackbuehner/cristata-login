<script lang="ts">
	import { goto } from '$app/navigation';

	import ErrorBox from '$components/ErrorBox.svelte';
	import Header from '$components/Header.svelte';

	let input: HTMLInputElement;

	let error = '';

	const handleSubmit = async (evt: SubmitEvent) => {
		evt.preventDefault();
		const tenant = input.value;

		const res = await fetch(`http://127.0.0.1:3000/v3/${tenant}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				query: 'query { userPublic(_id: "000000000000000000000000") { _id } }'
			})
		});

		if (res.status === 404) {
			error =
				'<b>We could not find your organization.</b> \
        Make sure you are using the correct URL or ask \
        someone in your organization for help.';
			// tenant does not exist
		} else if (res.status === 200) {
			error = '';
			goto(`/${tenant}`);
			// tenant exists
		} else {
			// something else went wrong
			error = `<b>An unexpected error occured.</b> Error text: [${res.status}] ${res.statusText}`;
		}
	};
</script>

<Header heading="Sign in to your instance" caption="Enter your organization's Cristata URL" />

{#if error}
	<ErrorBox html={error} />
{/if}

<form on:submit={handleSubmit}>
	<div class="tenant">
		<span on:click={() => input.focus()} style="padding-left: 12px">cristata.app/</span>
		<input bind:this={input} name="tenant" type="text" placeholder="your-organization" />
	</div>
	<input type="submit" value="Continue" />
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		max-width: 400px;
		margin: 48px auto;
	}

	form input[type='submit'] {
		margin-top: 14px;
		height: 40px;
		font-family: 'Rubik', sans-serif;
		font-weight: 600;
		font-size: 16px;
		background-color: transparent;
		border: 2px solid var(--textColorLighter);
		color: var(--textColorLighter);
		border-radius: 3px;
	}
	form input[type='submit']:hover {
		background-color: rgba(255, 255, 255, 0.06);
	}
	form input[type='submit']:active {
		background-color: rgba(255, 255, 255, 0.12);
	}

	div.tenant {
		display: inline-flex;
		align-items: center;
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 16px;
		box-shadow: 0 0 0 1px inset #484848;
		border-radius: 3px;
		color: var(--textColorLight);
		height: 40px;
	}
	div.tenant:hover {
		box-shadow: 0 0 0 1px inset #646464;
	}
	div.tenant:focus-within {
		box-shadow: 0 0 0 2px inset var(--primary-alt);
	}

	div.tenant input {
		appearance: none;
		border: none;
		padding: 0;
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 16px;
		background-color: transparent;
		height: 40px;
		color: var(--textColorLight);
		flex-grow: 1;
	}
	div.tenant input:focus {
		outline: none;
	}
</style>
