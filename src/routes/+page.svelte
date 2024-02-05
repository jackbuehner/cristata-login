<script lang="ts">
	import ErrorBox from '$components/ErrorBox.svelte';
	import Form from '$components/Form.svelte';
	import Header from '$components/Header.svelte';
	import NProgress from 'nprogress';

	let input: HTMLInputElement;

	let error = '';

	const handleSubmit = async (evt: SubmitEvent) => {
		evt.preventDefault();
		NProgress.start();

		setTimeout(() => {
			NProgress.done();
			error =
				'<b>We could not find your organization.</b> \
		Make sure you are using the correct URL or ask \
		someone in your organization for help.';
		}, 500)
	};
</script>

<Header heading="Sign in to your instance" caption="Enter your organization's Cristata URL" />

{#if error}
	<ErrorBox html={error} />
{/if}

<Form {handleSubmit} submitText={'Continue'}>
	<div class="tenant">
		<span on:click={() => input.focus()} style="padding-left: 12px">cristata.app/</span>
		<input bind:this={input} name="tenant" type="text" placeholder="your-organization" />
	</div>
</Form>

<style>
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
