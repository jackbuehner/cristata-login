<script lang="ts">
	export let elem: HTMLButtonElement | undefined = undefined;
	export let style: string = '';
</script>

<button bind:this={elem} on:click on:dblclick {style}><slot /></button>

<style>
	button {
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
	}
	button:hover,
	button:focus {
		background-color: rgba(255, 255, 255, 0.06);
	}
	button:active {
		background-color: rgba(255, 255, 255, 0.12);
	}
</style>
