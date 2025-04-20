<script lang="ts">
	import { invalidateAll } from '$app/navigation'
	import IconButton from '$lib/components/IconButton.svelte'
	import { faUserGroup, faXmark } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	let { data } = $props()
	let follow_notifications = $derived(data.follow_notifications)

	async function delete_follow_notification(id: number) {
		const res = await fetch(`/api/notifications/follow/${id}`, { method: 'DELETE' })
		if (res.ok) {
			invalidateAll()
		}
		// TODO: error handling
	}

	async function delete_all_follow_notifications() {
		const confirmed = confirm(
			`Are you sure you want to delete all ${follow_notifications.length} follow notifications?`
		)
		if (!confirmed) return
		const res = await fetch('/api/notifications/follow', { method: 'DELETE' })
		if (res.ok) {
			invalidateAll()
		}
		// TODO: error handling
	}
</script>

<svelte:head>
	<title>Twelte - Notifications ({data.number_unread})</title>
</svelte:head>

<h2>Notifications</h2>

<menu>
	<p>You have {data.number_unread} unread notifications.</p>

	{#if follow_notifications.length > 0}
		<IconButton icon={faXmark} onclick={delete_all_follow_notifications}></IconButton>
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

<style>
	.notification {
		margin-block: 1rem;
		display: flex;
		justify-content: space-between;

		&.read div {
			opacity: 0.3;
		}
	}

	menu {
		display: flex;
		justify-content: space-between;
		align-items: start;
	}
</style>
