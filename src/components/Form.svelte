<script lang="ts">
	export let handleSubmit: (evt: SubmitEvent) => Promise<void>;
	export let submitText: string = 'Submit';
</script>

<form on:submit={handleSubmit}>
	<slot />
	<input type="submit" value={submitText} />
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
</style>
