<script lang="ts">
	let { data } = $props()
	let hashtags = $derived(data.hashtags)
	let period = $derived(data.period)
</script>

<svelte:head>
	<title>Popular Hashtags</title>
</svelte:head>

<header>
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
