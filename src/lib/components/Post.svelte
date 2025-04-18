<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Post as PostType } from '$lib/types'
	import { format_date } from '$lib/utils'
	import { faHeart } from '@fortawesome/free-regular-svg-icons'
	import { faHeart as faHeartFilled, faReply, faXmark } from '@fortawesome/free-solid-svg-icons'
	import IconButton from './IconButton.svelte'

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

<div>
	<div>
		<a class="profile-link" href="/profile/{post.author_handle}">@{post.author_handle}</a>
		&ndash;
		<span title={post.created_at} class="time">
			{format_date(post.created_at)}
		</span>
	</div>

	<div class="content">{post.content}</div>

	<menu>
		<IconButton
			icon={post.liked_by_user ? faHeartFilled : faHeart}
			onclick={toggle_like}
			aria_label={post.liked_by_user ? 'Unlike' : 'Like'}
			disabled={!authenticated || is_author}
			color={post.liked_by_user ? 'var(--primary-color)' : 'currentColor'}
		>
			<span aria-label="number of likes">
				{post.likes_count}
			</span>
		</IconButton>

		<IconButton icon={faReply} onclick={() => goto(`/post/${post.id}`)} aria_label="Reply">
			<span aria-label="number of replies">
				{post.replies_count}
			</span>
		</IconButton>

		{#if is_author}
			<IconButton icon={faXmark} onclick={delete_post} aria_label="Delete" />
		{/if}
	</menu>
</div>

<style>
	.profile-link {
		text-decoration: none;
		font-weight: 500;
	}

	.time {
		color: var(--secondary-font-color);
	}

	.content {
		margin-block: 0.5rem;
		font-size: 1.125rem;
	}

	menu {
		display: flex;
		gap: 0.5rem;
	}
</style>
