<script lang="ts">
	let { data } = $props()
	let hashtags = $derived(data.hashtags)
	let period = $derived(data.period)
</script>

<svelte:head>
	<title>Twelte - Popular Hashtags</title>
</svelte:head>

<header class="page-header">
	{#if period === 'day'}
		<h2>Popular Hashtags (Today)</h2>
		<a href="/hashtags?period=all">All Time</a>
	{:else}
		<h2>Popular Hashtags (All Time)</h2>
		<a href="/hashtags?period=day">Today</a>
	{/if}
</header>

<ul>
	{#each hashtags as hashtag}
		<li>
			<a class="hashtag" href="/hashtags/{hashtag.tag}">#{hashtag.tag}</a> ({hashtag.count})
		</li>
	{/each}
</ul>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	@media (max-width: 720px) {
		header {
			flex-direction: column;
			align-items: start;
		}

		header a {
			margin-left: auto;
			margin-top: -0.5rem;
		}
	}

	.hashtag {
		color: var(--primary-color);
		text-decoration: none;
	}

	ul {
		padding-left: 1.5rem;
	}

	li {
		margin-bottom: 0.25rem;
	}
</style>
