<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Post as PostType } from '$lib/types'
	import { faHeart } from '@fortawesome/free-regular-svg-icons'
	import { faHeart as faHeartFilled, faReply, faXmark } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	type Props = {
		post: PostType
		is_author: boolean
		authenticated: boolean
		handle_deletion: () => void
	}

	let { post, is_author, authenticated, handle_deletion }: Props = $props()

	function toggle_like() {
		post.liked_by_user ? unlike() : like()
	}

	async function like() {
		const res = await fetch(`/api/post/${post.id}/like`, { method: 'POST' })
		if (!res.ok) return
		post.likes_count++
		post.liked_by_user = true
	}

	async function unlike() {
		const res = await fetch(`/api/post/${post.id}/unlike`, { method: 'POST' })
		if (!res.ok) return
		post.likes_count--
		post.liked_by_user = false
	}

	async function delete_post() {
		const confirmed = confirm('Are you sure you want to delete this post?')
		if (!confirmed) return

		const res = await fetch(`/api/post/${post.id}`, { method: 'DELETE' })
		if (!res.ok) return

		handle_deletion()
	}
</script>

<div class="post">
	<strong>
		<a href="/profile/{post.author_handle}">@{post.author_handle}</a>
	</strong>
	<br />
	<div>{post.content}</div>
	<div>
		<button
			disabled={!authenticated || is_author}
			onclick={toggle_like}
			aria-label={post.liked_by_user ? 'Unlike' : 'Like'}
		>
			<Fa icon={post.liked_by_user ? faHeartFilled : faHeart} />

			<span aria-label="number of likes">
				{post.likes_count}
			</span>
		</button>

		<button onclick={() => goto(`/post/${post.id}`)} aria-label="reply">
			<Fa icon={faReply} />
		</button>
		{#if is_author}
			<button onclick={delete_post} aria-label="Delete">
				<Fa icon={faXmark} />
			</button>
		{/if}
	</div>
</div>

<style>
	.post {
		margin-bottom: 1rem;
		width: 280px;
	}
</style>
