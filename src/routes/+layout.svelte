<script lang="ts">
	import './app.css'
	import Header from '$lib/components/Header.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import Dialog from '$lib/components/Dialog.svelte'

	let { data, children } = $props()
</script>

<div class="wrapper">
	<Header user={data.user} />

	<main>
		{@render children?.()}
	</main>

	<Footer />
</div>

<Dialog />

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
