<script>
	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import CristataLogo from '$components/CristataLogo.svelte';
	import NProgress from 'nprogress';

	// configure the navigation progress bar
	NProgress.configure({
		parent: 'article',
		easing: 'ease',
		speed: 500,
		trickle: true,
		trickleSpeed: 200,
		showSpinner: false
	});

	// show progress bar on page navigate
	beforeNavigate(() => {
		NProgress.start();
	});

	// hide progress bar on navigation end
	afterNavigate(() => {
		NProgress.done();
	});
</script>

<div style="width: 700px; margin: 0 auto; padding-bottom: 1px;">
	<header>
		<div class="brand">
			<CristataLogo width={26} />
			Cristata
		</div>
		<div class="copyright">© Jack Buehner</div>
	</header>

	<article><slot /></article>
</div>

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
		padding: 1px;
		overflow: hidden;
		border-radius: 4px;
		margin: 40px;
		background-color: #212121;
		position: relative;
	}
</style>
