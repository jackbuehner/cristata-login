<script lang="ts">
	export let html: string;
</script>

<div class="error">
	<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M10.91 2.782a2.25 2.25 0 0 1 2.975.74l.083.138 7.759 14.009a2.25 2.25 0 0 1-1.814 3.334l-.154.006H4.243a2.25 2.25 0 0 1-2.041-3.197l.072-.143L10.031 3.66a2.25 2.25 0 0 1 .878-.878Zm9.505 15.613-7.76-14.008a.75.75 0 0 0-1.254-.088l-.057.088-7.757 14.008a.75.75 0 0 0 .561 1.108l.095.006h15.516a.75.75 0 0 0 .696-1.028l-.04-.086-7.76-14.008 7.76 14.008ZM12 16.002a.999.999 0 1 1 0 1.997.999.999 0 0 1 0-1.997ZM11.995 8.5a.75.75 0 0 1 .744.647l.007.102.004 4.502a.75.75 0 0 1-1.494.103l-.006-.102-.004-4.502a.75.75 0 0 1 .75-.75Z"
		/>
	</svg>
	<div>
		{@html html}
	</div>
</div>

<style>
	div.error {
		max-width: 500px;
		margin: 0 auto;
		border: 1px solid hsl(30deg 100% 75%);
		border-radius: 3px;
		background-color: hsla(30deg 100% 75% / 10%);
		color: var(--textColorLight);
		padding: 16px;
		font-family: 'Rubik', sans-serif;
		font-weight: 400;
		font-size: 15px;
		line-height: 1.4;
		display: flex;
		flex-direction: row;
		gap: 16px;
	}

	svg {
		fill: hsl(30deg 100% 75%);
		flex-grow: 0;
		flex-shrink: 0;
	}
</style>
