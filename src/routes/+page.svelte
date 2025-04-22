<script lang="ts">
	import PostList from '$lib/components/PostList.svelte'

	let { data } = $props()
	let title = $derived(data.filter === 'all' ? 'Feed - All posts' : 'Feed - Following')
</script>

<svelte:head>
	<title>Twelte - Feed</title>
</svelte:head>

<header class="page-header">
	<h2>{title}</h2>
	{#if data.user}
		{#if data.filter === 'all'}
			<a href="?filter=following">Following</a>
		{:else}
			<a href="?filter=all">All Posts</a>
		{/if}
	{/if}
</header>

{#key data.filter}
	<PostList
		initial_posts={data.posts}
		limit={data.limit}
		user_id={data.user?.id}
		filter={data.filter}
	/>
{/key}

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
