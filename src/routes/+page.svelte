<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();
	let posts = $derived(data.posts);

	async function like(post_id: number) {
		await fetch(`/api/like`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ post_id })
		});

		await invalidateAll(); // TODO: improve that
	}

	async function unlike(post_id: number) {
		await fetch(`/api/unlike`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ post_id })
		});

		await invalidateAll(); // TODO: improve that
	}

	async function delete_post(post_id: number) {
		// TODO
	}
</script>

<h1>Twelte</h1>

<menu>
	<a href="/post/create">Create New Post</a>
</menu>

<h2>Posts</h2>

{#if posts?.length}
	<div>
		{#each posts as post (post.id)}
			{@const is_owner = post.user_id === data.user?.id}
			<div class="post">
				<strong>@{post.user_handle}</strong>
				<br />
				<div>{post.content}</div>
				{#if post.liked_by_user}
					<span>❤️</span>
				{/if}
				<div>Likes: {post.likes_count}</div>
				{#if data.user}
					<menu>
						{#if post.liked_by_user}
							<button onclick={() => unlike(post.id)}>Unlike</button>
						{:else}
							<button onclick={() => like(post.id)}>Like</button>
						{/if}
						{#if is_owner}
							<button onclick={() => delete_post(post.id)}>Delete</button>
						{/if}
					</menu>
				{/if}
			</div>
		{/each}
	</div>
{:else}
	<p>No posts yet.</p>
{/if}

<style>
	.post {
		margin-bottom: 1rem;
		width: 280px;
	}
</style>
