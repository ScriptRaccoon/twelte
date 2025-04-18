<script lang="ts">
	import { enhance } from '$app/forms'
	import PostList from '$lib/components/PostList.svelte'

	let { data } = $props()

	let profile = $derived(data.profile)
</script>

<h2>
	{profile.display_name}
</h2>

<p>
	@{profile.handle}
</p>

<p>
	<strong>Bio:</strong>
	{profile.bio}
</p>

<p>
	Number of Posts: {profile.posts_count}
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
	<p>You are following @{profile.handle}.</p>
{/if}

{#if profile.followed}
	<p>@{profile.handle} is following you.</p>
{/if}

{#if data.user && profile.user_id !== data.user.id}
	{#if !profile.following}
		<form action="?/follow" method="POST" use:enhance>
			<input type="hidden" name="followed_id" value={profile.user_id} />
			<button>Follow</button>
		</form>
	{:else}
		<form action="?/unfollow" method="POST" use:enhance>
			<input type="hidden" name="followed_id" value={profile.user_id} />
			<button>Unfollow</button>
		</form>
	{/if}
{/if}

<PostList
	initial_posts={data.posts}
	limit={data.limit}
	user_id={data.user?.id}
	author_id={profile.user_id}
/>
