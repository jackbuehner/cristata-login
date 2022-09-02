<script lang="ts">
	export let password = false;
	export let value = '';
	export let margin = true;
	export let label = '';
	export let placeholder = '';
</script>

{#if label}
	<label for={label.replaceAll(' ', '')}>{label}</label>
{/if}

{#if password}
	<input type="password" id={label.replaceAll(' ', '')} bind:value class:margin {placeholder} />
{:else}
	<input type="text" id={label.replaceAll(' ', '')} bind:value class:margin {placeholder} />
{/if}

<style>
	input {
		appearance: none;
		border: none;
		padding: 0 10px;
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 16px;
		background-color: transparent;
		height: 40px;
		color: var(--textColorLight);
		flex-grow: 1;
		box-shadow: 0 0 0 1px inset #484848;
		border-radius: 3px;
		outline: none;
		transition: box-shadow 200ms;
	}
	input:hover {
		box-shadow: 0 0 0 1px inset #646464;
	}
	input:focus-within {
		box-shadow: 0 0 0 2px inset var(--primary-alt);
	}

	input.margin {
		margin-bottom: 16px;
	}

	label {
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 15px;
		line-height: 1.3;
		margin-bottom: 8px;
		color: var(--textColorLight);
	}
</style>
