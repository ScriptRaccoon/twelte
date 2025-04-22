<script lang="ts">
	import { goto } from '$app/navigation'
	import type { Post as PostType } from '$lib/types'
	import { cut_text, format_date, tokenize_content } from '$lib/utils'
	import { faComment, faHeart } from '@fortawesome/free-regular-svg-icons'
	import {
		faHeart as faHeartFilled,
		faShare,
		faXmark,
		faComment as faCommentFilled
	} from '@fortawesome/free-solid-svg-icons'
	import IconButton from './IconButton.svelte'
	import { page } from '$app/state'
	import { open_dialog } from './Dialog.svelte'

	type Props = {
		post: PostType
		is_author: boolean
		authenticated: boolean
		handle_deletion: () => void
	}

	let { post, is_author, authenticated, handle_deletion }: Props = $props()

	let copied = $state(false)

	function toggle_like() {
		post.liked_by_user ? unlike() : like()
	}

	async function like() {
		const res = await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
		if (!res.ok) return
		post.likes_count++
		post.liked_by_user = true
	}

	async function unlike() {
		const res = await fetch(`/api/posts/${post.id}/unlike`, { method: 'POST' })
		if (!res.ok) return
		post.likes_count--
		post.liked_by_user = false
	}

	function delete_post() {
		open_dialog({
			modal: true,
			text: 'Are you sure you want to delete this post?',
			confirm: {
				text: 'Delete',
				action: async () => {
					const res = await fetch(`/api/posts/${post.id}`, { method: 'DELETE' })
					if (res.ok) handle_deletion()
				}
			}
		})
	}

	async function copy_url() {
		const url = `${page.url.origin}/post/${post.id}`
		await navigator.clipboard.writeText(url)
		copied = true
		setTimeout(() => {
			copied = false
		}, 2000)
	}
</script>

<article>
	<div class="post-header">
		{#if post.author_avatar_url}
			<img src={post.author_avatar_url} alt="Avatar" class="avatar" />
		{:else}
			<span class="placeholder">
				{post.author_name[0].toUpperCase()}
			</span>
		{/if}

		<span>
			<a class="profile-link" href="/profile/{post.author_handle}">
				{cut_text(post.author_name, 20)}
			</a>
			&ndash;
			<span title={post.created_at} class="time">
				{format_date(post.created_at)}
			</span>
		</span>
	</div>

	<div class="content">
		{#each tokenize_content(post.content) as { text, type }}
			{#if type === 'text'}
				<span>{text}</span>
			{:else if type === 'hashtag'}
				<a class="hashtag" href="/hashtags/{text.slice(1)}">{text}</a>
			{:else if type === 'url'}
				<a class="link" target="_blank" rel="noopener noreferrer" href={text}>
					{cut_text(text, 38)}
				</a>
			{/if}
		{/each}
	</div>

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

		<IconButton
			icon={post.replies_count ? faCommentFilled : faComment}
			onclick={() => goto(`/post/${post.id}`)}
			aria_label="Reply"
		>
			<span aria-label="number of replies">
				{post.replies_count}
			</span>
		</IconButton>

		<IconButton icon={faShare} onclick={copy_url} aria_label="Copy post URL" />

		{#if copied}
			<span class="small">Copied URL</span>
		{/if}

		{#if is_author}
			<IconButton icon={faXmark} onclick={delete_post} aria_label="Delete" />
		{/if}
	</menu>
</article>

<style>
	.post-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.avatar,
	.placeholder {
		--size: 28px;
		width: var(--size);
		height: var(--size);
		border-radius: 50%;
	}

	.placeholder {
		background-color: var(--secondary-bg-color);
		display: inline-flex;
		justify-content: center;
		align-items: center;
		font-size: 0.825rem;
		color: var(--secondary-font-color);
		font-weight: bold;
	}

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

	.hashtag {
		color: var(--primary-color);
		text-decoration: none;
	}

	menu {
		margin-top: 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.link {
		color: var(--link-color);
	}
</style>
