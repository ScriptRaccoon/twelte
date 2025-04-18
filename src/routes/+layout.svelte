<script lang="ts">
	import './app.css'
	import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'

	let { data, children } = $props()
</script>

<div class="wrapper">
	<Header user={data.user} />

	<div>
		{@render children?.()}
	</div>

	<Footer />
</div>

<style>
	.wrapper {
		max-width: 42rem;
		margin: 0 auto;
		padding-inline: 0.75rem;
		display: grid;
		min-height: 100vh;
		grid-template-rows: auto auto 1fr;
	}
</style>
