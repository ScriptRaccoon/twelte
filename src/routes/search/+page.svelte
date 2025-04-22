<script lang="ts">
	import IconButton from '$lib/components/IconButton.svelte'
	import PostList from '$lib/components/PostList.svelte'
	import { faSearch } from '@fortawesome/free-solid-svg-icons'

	let { data } = $props()
</script>

<svelte:head>
	<title>Search</title>
</svelte:head>

<header class="page-header">
	<h2>Search</h2>
</header>

<form method="GET">
	<div class="input-group">
		<label for="search">Search</label>
		<div class="bar">
			<input type="search" name="q" id="search" required value={data.q} />
			<IconButton icon={faSearch} />
		</div>
	</div>
</form>

{#key data.q}
	{#if data.q && data.posts}
		<h3>Results</h3>
		<PostList
			initial_posts={data.posts}
			user_id={data.user?.id}
			limit={data.limit}
			fetch_more_url="/api/posts/search?q={data.q}"
		/>
	{/if}
{/key}

<style>
	.bar {
		display: flex;
		gap: 0.5rem;
	}

	h3 {
		margin-bottom: 0.5rem;
	}
</style>
