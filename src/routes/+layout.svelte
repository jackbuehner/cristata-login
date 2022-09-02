<script>
	import CristataLogo from '$components/CristataLogo.svelte';
</script>

<header>
	<div class="brand">
		<CristataLogo width={26} />
		Cristata
	</div>
	<div class="copyright">© Jack Buehner</div>
</header>

<article><slot /></article>

<style>
	header {
		padding: 20px 40px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}

	div.brand {
		display: flex;
		flex-direction: row;
		align-items: center;
		font-family: 'Adamant BG';
		font-size: 18px;
		font-weight: 600;
		letter-spacing: 0.3px;
		gap: 16px;
		color: #e0e0e0;
		fill: currentColor;
	}

	div.copyright {
		font-family: 'Rubik', sans-serif;
		font-size: 14px;
		font-weight: 400;
		color: hsl(253deg 54% 70%);
	}

	article {
		border: 1px solid transparent;
		border-radius: 4px;
		margin: 40px;
		background-color: #212121;
	}
</style>
