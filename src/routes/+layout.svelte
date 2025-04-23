<script lang="ts">
	import './app.css'
	import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import Dialog from '$lib/components/Dialog.svelte'
	import ScrollUp from '$lib/components/ScrollUp.svelte'

	let { data, children } = $props()
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<div class="wrapper">
	<Header user={data.user} />

	<main>
		{@render children?.()}
	</main>

	<Footer />
</div>

<Dialog />
<ScrollUp />

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
