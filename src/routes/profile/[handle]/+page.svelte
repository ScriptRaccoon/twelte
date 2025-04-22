<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'
	import PostList from '$lib/components/PostList.svelte'
	import type { Profile } from '$lib/types'

	let { data, form } = $props()

	let profile: Profile = $derived(data.profile)
</script>

<svelte:head>
	<title>Twelte - Profile by {profile.name}</title>
</svelte:head>

<header class="page-header">
	<h2>{profile.name}</h2>
	<span class="handle">@{profile.handle}</span>
</header>

<section class="bio-avatar">
	<div>
		{#if profile.avatar_url}
			<img src={profile.avatar_url} alt="Avatar" class="avatar" />
		{:else}
			<div class="placeholder">
				{profile.name[0].toUpperCase()}
			</div>
		{/if}
	</div>
	{#if profile.bio}
		<div>
			<span class="small">Bio</span>
			<div class="bio">
				{profile.bio}
			</div>
			{#if profile.website}
				<a class="link" href={profile.website} target="_blank" rel="noopener noreferrer">
					{profile.website}
				</a>
			{/if}
		</div>
	{/if}
</section>

<p class="stats">
	{profile.posts_count} posts &bullet;
	{profile.replies_count} replies &bullet;
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
		<form action="?/follow" method="POST" use:enhance>
			<input type="hidden" name="followed_id" value={profile.id} />
			<button class="button">Follow</button>
		</form>
	{:else}
		<form action="?/unfollow" method="POST" use:enhance>
			<input type="hidden" name="followed_id" value={profile.id} />
			<button class="button">Unfollow</button>
		</form>
	{/if}

	{#if form?.error}
		<Message type="error">
			{form.error}
		</Message>
	{/if}
{/if}

<section>
	<h3>Posts</h3>
	<PostList
		initial_posts={data.posts}
		user_id={data.user?.id}
		limit={data.limit}
		fetch_more_url="/api/posts/profile/{profile.id}"
	/>
</section>

<style>
	header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.2rem 1rem;
	}

	h3 {
		margin-top: 1.5rem;
		margin-bottom: 0.5rem;
	}

	.handle {
		color: var(--primary-color);
	}

	.bio-avatar {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: auto 1fr;
		margin-block: 1.5rem;
	}

	.placeholder,
	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
	}

	.placeholder {
		background-color: var(--secondary-bg-color);
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--secondary-font-color);
		font-size: 45px;
		font-weight: bold;
	}

	.bio {
		background-color: var(--secondary-bg-color);
		margin-block: 0.1rem 1rem;
		padding: 0.4rem 0.8rem;
		border-radius: 0.25rem;
	}

	.stats {
		font-size: 1.125rem;
	}
</style>
