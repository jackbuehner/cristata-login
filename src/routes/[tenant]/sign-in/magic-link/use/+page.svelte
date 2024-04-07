<script lang="ts">
	import Button from '$components/Button.svelte';
	import ErrorBox from '$components/ErrorBox.svelte';
	import Header from '$components/Header.svelte';

	let error = 'This magic sign-in link is no longer valid.';
</script>

<Header heading="Sign in to Cristata" caption="" />

<div class="box">
	<ErrorBox html={error} />
	<Button style="width: 100%; height: 40px; margin-top: 20px;" disabled>
		Try again
	</Button>
	<Button style="width: 100%; height: 40px; margin-top: 20px;" href="/">
		Get a new magic link
	</Button>
</div>

<style>
	div.box {
		max-width: 400px;
		margin: 40px auto 50px auto;
	}
</style>
