<script lang="ts">
	import { page } from '$app/state';
	import Post from '$lib/components/Post.svelte';

	let { data } = $props();
	let posts = $derived(data.posts);
	let profile = $derived(data.profile);
	let limit = $derived(data.limit);
</script>

<h1>
	{profile.display_name}
</h1>

<p>
	@{profile.handle}
</p>

<p>
	<strong>Bio:</strong>
	{profile.bio}
</p>

<h2>Posts</h2>

{#if posts?.length}
	<div>
		{#each posts as post (post.id)}
			<Post {post} is_owner={post.user_id === data.user?.id} authenticated={!!data.user} />
		{/each}
	</div>

	<a href="{page.url.pathname}?limit={limit + 10}">Load More</a>
	<!-- TODO: keep scroll position -->
	<!-- TODO: add more posts instead of reloading whole page -->
	<!-- TODO: hide link when all posts are shown -->
{:else}
	<p>No posts yet.</p>
{/if}
