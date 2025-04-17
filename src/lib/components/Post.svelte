<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import type { Post as PostType } from '$lib/types'

	type Props = {
		post: PostType
		is_owner: boolean
		authenticated: boolean
	}

	let { post, is_owner, authenticated }: Props = $props()

	async function like(post_id: number) {
		await fetch(`/api/post/${post_id}/like`, { method: 'POST' })

		await invalidateAll() // TODO: improve that
	}

	async function unlike(post_id: number) {
		await fetch(`/api/post/${post_id}/unlike`, { method: 'POST' })

		await invalidateAll() // TODO: improve that
	}

	async function delete_post(post_id: number) {
		const confirmed = confirm('Are you sure you want to delete this post?')
		if (!confirmed) return

		await fetch(`/api/post/${post_id}`, { method: 'DELETE' })

		await invalidateAll() // TODO: improve that
	}
</script>

<div class="post">
	<strong>
		<a href="/profile/{post.user_handle}">@{post.user_handle}</a>
	</strong>
	<br />
	<div>{post.content}</div>
	{#if post.liked_by_user}
		<span>❤️</span>
	{/if}
	<div>Likes: {post.likes_count}</div>
	<a href="/post/{post.id}">Replies</a>

	{#if authenticated}
		<menu>
			{#if !is_owner}
				{#if post.liked_by_user}
					<button onclick={() => unlike(post.id)}>Unlike</button>
				{:else}
					<button onclick={() => like(post.id)}>Like</button>
				{/if}
			{:else}
				<button onclick={() => delete_post(post.id)}>Delete</button>
			{/if}
		</menu>
	{/if}
</div>

<style>
	.post {
		margin-bottom: 1rem;
		width: 280px;
	}
</style>
