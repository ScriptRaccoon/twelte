<script>
	import { browser } from '$app/environment'
	import { page } from '$app/state'
	import IconButton from '$lib/components/IconButton.svelte'
	import { faArrowLeft, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	function goback() {
		if (browser) window.history.back()
	}
</script>

<svelte:head>
	<title>Twelte - Error</title>
</svelte:head>

<h2>Oups! Something went wrong</h2>

<p class="status">{page.status}</p>
<p class="message"><Fa icon={faTriangleExclamation} /> {page.error?.message}</p>

<IconButton icon={faArrowLeft} onclick={goback}>Go back</IconButton>

<style>
	.status {
		font-size: 2.5rem;
		color: var(--primary-color);
	}

	.message {
		margin-bottom: 2rem;
		font-size: 1.25rem;
	}
</style>
