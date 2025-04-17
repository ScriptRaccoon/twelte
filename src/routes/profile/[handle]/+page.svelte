<script lang="ts">
	import { enhance } from '$app/forms';
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

<p>
	<strong>Followers:</strong>
	{profile.followers_count}
</p>

<p>
	<strong>Following:</strong>
	{profile.following_count}
</p>

{#if profile.following}
	<p>You are following {profile.handle}.</p>
{/if}

{#if data.user && profile.id !== data.user.id}
	<!-- TODO: display only one option -->
	<form action="?/follow" method="POST" use:enhance>
		<input type="hidden" name="followed_id" value={profile.id} />
		<button>Follow</button>
	</form>

	<form action="?/unfollow" method="POST" use:enhance>
		<input type="hidden" name="followed_id" value={profile.id} />
		<button>Unfollow</button>
	</form>
{/if}

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
