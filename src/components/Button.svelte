<script lang="ts">
	export let elem: HTMLButtonElement | undefined = undefined;
	export let style: string = '';
	export let href: string = '';
	export let disabled: boolean = false;
</script>

{#if href}
	<a {href} {style}><slot /></a>
{:else}
	<button bind:this={elem} on:click on:dblclick {style} {disabled}><slot /></button>
{/if}

<style>
	button,
	a {
		display: flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		cursor: default;
		height: 32px;
		font-family: 'Rubik', sans-serif;
		font-weight: 600;
		font-size: 16px;
		background-color: transparent;
		border: 2px solid var(--textColorLighter);
		color: var(--textColorLighter);
		border-radius: 3px;
		min-width: 60px;
		outline: none;
		transition: background-color 200ms;
		box-sizing: border-box;
	}
	button:hover,
	a:hover,
	button:focus,
	a:focus {
		background-color: rgba(255, 255, 255, 0.06);
	}
	button:active,
	a:active {
		background-color: rgba(255, 255, 255, 0.12);
	}
</style>
