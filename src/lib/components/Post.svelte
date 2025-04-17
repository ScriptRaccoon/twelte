<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import type { Post as PostType } from '$lib/types'
	import { faHeart } from '@fortawesome/free-regular-svg-icons'
	import { faHeart as faHeartFilled, faReply, faXmark } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	type Props = {
		post: PostType
		is_owner: boolean
		authenticated: boolean
	}

	let { post, is_owner, authenticated }: Props = $props()

	function toggle_like() {
		post.liked_by_user ? unlike() : like()
	}

	async function like() {
		await fetch(`/api/post/${post.id}/like`, { method: 'POST' })

		await invalidateAll() // TODO: improve that
	}

	async function unlike() {
		await fetch(`/api/post/${post.id}/unlike`, { method: 'POST' })

		await invalidateAll() // TODO: improve that
	}

	async function delete_post() {
		const confirmed = confirm('Are you sure you want to delete this post?')
		if (!confirmed) return

		await fetch(`/api/post/${post.id}`, { method: 'DELETE' })

		await invalidateAll() // TODO: improve that
	}
</script>

<div class="post">
	<strong>
		<a href="/profile/{post.user_handle}">@{post.user_handle}</a>
	</strong>
	<br />
	<div>{post.content}</div>
	<div>
		<button
			disabled={!authenticated || is_owner}
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
		{#if is_owner}
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
