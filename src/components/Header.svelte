<script lang="ts">
	export let heading: string;
	export let caption: string;
</script>

<h1>{heading}</h1>
<p>{caption}</p>

<style>
	h1 {
		color: var(--textColorLight);
		font-family: 'Rubik', sans-serif;
		font-size: 32px;
		text-align: center;
		font-weight: 600;
		margin: 48px 0 16px 0;
	}

	p {
		color: var(--textColorLighter);
		font-family: 'Rubik', sans-serif;
		font-size: 16px;
		text-align: center;
		font-weight: 400;
		margin: 16px 0 48px 0;
	}
</style>
