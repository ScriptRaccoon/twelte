<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import IconButton from '$lib/components/IconButton.svelte'
	import { cut_text } from '$lib/utils.js'
	import { faComment, faHeart, faUserGroup, faXmark } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	let { data } = $props()
	let follow_notifications = $derived(data.follow_notifications)
	let like_notifications = $derived(data.like_notifications)
	let reply_notifications = $derived(data.reply_notifications)

	async function delete_follow_notification(id: number) {
		const res = await fetch(`/api/notifications/follow/${id}`, { method: 'DELETE' })
		if (res.ok) {
			invalidateAll()
		}
		// TODO: error handling
	}

	async function delete_like_notification(id: number) {
		const res = await fetch(`/api/notifications/like/${id}`, { method: 'DELETE' })
		if (res.ok) {
			invalidateAll()
		}
		// TODO: error handling
	}

	async function delete_reply_notification(id: number) {
		const res = await fetch(`/api/notifications/reply/${id}`, { method: 'DELETE' })
		if (res.ok) {
			invalidateAll()
		}
		// TODO: error handling
	}

	async function delete_all_notifications() {
		const confirmed = confirm(
			`Are you sure you want to delete all ${data.total_number} notifications?`
		)
		if (!confirmed) return

		const res = await fetch('/api/notifications', { method: 'DELETE' })

		if (res.ok) {
			invalidateAll()
		}
		// TODO: error handling
	}
</script>

<svelte:head>
	<title>Twelte - Notifications ({data.number_unread})</title>
</svelte:head>

<header class="page-header">
	<h2>Notifications</h2>
</header>

<menu>
	<p>You have {data.number_unread} unread notifications.</p>

	{#if data.total_number > 0}
		<IconButton icon={faXmark} onclick={delete_all_notifications}></IconButton>
	{/if}
</menu>

{#each follow_notifications as { id, name, handle, read } (id)}
	<div class="notification" class:read>
		<div>
			<Fa icon={faUserGroup} /> &nbsp;
			<a href="/profile/{handle}">{name}</a> has started following you.
		</div>
		<IconButton small={true} icon={faXmark} onclick={() => delete_follow_notification(id)} />
	</div>
{/each}

{#each like_notifications as { id, name, handle, read, post_id, content } (id)}
	<div class="notification" class:read>
		<div>
			<Fa icon={faHeart} color="var(--primary-color)" /> &nbsp;
			<a href="/profile/{handle}">{name}</a> has liked your post.
			<div class="excerpt">
				<a href="/post/{post_id}">{cut_text(content, 50)}</a>
			</div>
		</div>
		<IconButton small={true} icon={faXmark} onclick={() => delete_like_notification(id)} />
	</div>
{/each}

{#each reply_notifications as { id, name, handle, read, content, parent_id } (id)}
	<div class="notification" class:read>
		<div>
			<Fa icon={faComment} /> &nbsp;
			<a href="/profile/{handle}">{name}</a> has replied to your
			<a href="/post/{parent_id}">post</a>.
			<div class="excerpt">
				<a href="/post/{id}">{cut_text(content, 50)}</a>
			</div>
		</div>
		<IconButton small={true} icon={faXmark} onclick={() => delete_reply_notification(id)} />
	</div>
{/each}

<style>
	.notification {
		margin-block: 1.25rem;
		display: flex;
		justify-content: space-between;
		align-items: start;

		&.read div {
			opacity: 0.3;
		}
	}

	menu {
		display: flex;
		justify-content: space-between;
		align-items: start;
	}

	.excerpt {
		color: var(--secondary-font-color);
		margin-block: 0.25rem;
		padding-left: 1.75rem;
		a {
			text-decoration: none;
		}
	}
</style>
