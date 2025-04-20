<script lang="ts">
	import { enhance } from '$app/forms'
	import PostList from '$lib/components/PostList.svelte'
	import type { Profile } from '$lib/types'

	let { data } = $props()

	let profile: Profile = $derived(data.profile)
</script>

<svelte:head>
	<title>Twelte - Profile by {profile.name}</title>
</svelte:head>

<header>
	<h2>{profile.name}</h2>
	<span class="handle">@{profile.handle}</span>
</header>

{#if profile.bio}
	<span class="small">Bio</span>
	<div class="bio">
		{profile.bio}
	</div>
{/if}

<p>
	{profile.posts_count} posts &bullet;
	{profile.followers_count} followers &bullet;
	{profile.following_count} following
</p>

{#if profile.following || profile.followed}
	<p>
		{#if profile.followed}
			<span>
				{profile.name} is following you.
			</span>
		{/if}
		{#if profile.following}
			<span>
				You are following {profile.name}.
			</span>
		{/if}
	</p>
{/if}

{#if data.user && profile.id !== data.user.id}
	{#if !profile.following}
		<form action="?/follow" method="POST" use:enhance class="form">
			<input type="hidden" name="followed_id" value={profile.id} />
			<button class="button">Follow</button>
		</form>
	{:else}
		<form action="?/unfollow" method="POST" use:enhance class="form">
			<input type="hidden" name="followed_id" value={profile.id} />
			<button class="button">Unfollow</button>
		</form>
	{/if}
{/if}

<h3>Posts</h3>

<PostList
	initial_posts={data.posts}
	limit={data.limit}
	user_id={data.user?.id}
	author_id={profile.id}
/>

<style>
	header {
		display: flex;
		gap: 1rem;
		align-items: center;
	}

	.handle {
		color: var(--primary-color);
	}

	.bio {
		background-color: var(--secondary-bg-color);
		margin-block: 0.1rem 1rem;
		padding: 0.4rem 0.8rem;
		border-radius: 0.25rem;
	}
</style>
