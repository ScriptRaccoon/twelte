<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import { open_dialog } from '$lib/components/Dialog.svelte'
	import Message from '$lib/components/Message.svelte'
	import Textarea from '$lib/components/TextareaWithLimit.svelte'
	import { MAX_BIO_LENGTH } from '$lib/config'
	import type { AccountData } from '$lib/types'

	let { data, form } = $props()
	let account: AccountData = $derived(data.account)

	let files: FileList | null = $state(null)
	let avatar_form: HTMLFormElement | null = $state(null)

	$effect(() => {
		if (files?.length) avatar_form?.submit()
	})

	function delete_account() {
		open_dialog({
			text: 'Are you sure that you want to delete your account? This will erase all posts and data associated to your account. It cannot be undone.',
			modal: true,
			confirm: {
				text: 'Delete',
				action: async () => {
					const res = await fetch('/api/account', { method: 'DELETE' })
					if (res.ok) goto('/', { invalidateAll: true })
				}
			}
		})
	}
</script>

<svelte:head>
	<title>Twelte - Account @{account.handle}</title>
</svelte:head>

<header class="page-header">
	<h2>Account</h2>

	<span class="handle">@{account.handle}</span>

	<a class="profile-link" href="/profile/{account.handle}">View your Profile</a>
</header>

<section aria-label="avatar">
	<form
		bind:this={avatar_form}
		action="?/avatar"
		method="POST"
		use:enhance
		enctype="multipart/form-data"
	>
		<div class="image-container">
			{#if account.avatar_url}
				<img src={account.avatar_url} alt="Avatar" class="avatar" />
			{:else}
				<div class="placeholder"></div>
			{/if}
		</div>

		<input type="file" name="avatar" id="avatar" accept="image/*" class="sr-only" bind:files />
		<label for="avatar" class="button">
			{#if account.avatar_url}
				Update avatar
			{:else}
				Choose avatar
			{/if}
		</label>
	</form>

	{#if form?.error && form.action == 'avatar'}
		<Message type="error">
			{form.error}
		</Message>
	{/if}

	{#if form?.message && form.action === 'avatar'}
		<Message type="success">
			{form.message}
		</Message>
	{/if}
</section>

<section aria-label="basic information">
	<!-- We do not use use:enhance HERE since it is buggy for some reason -->
	<form action="?/edit" method="POST">
		<div class="input-group">
			<label for="email">Email</label>
			<input type="email" id="email" name="email" value={data.account.email} />
		</div>

		<div class="input-group">
			<label for="name">Name</label>
			<input type="text" id="name" name="name" value={account.name} />
		</div>

		<Textarea
			label="Bio"
			name="bio"
			limit={MAX_BIO_LENGTH}
			aria_label="bio"
			rows={3}
			initial_content={account.bio}
		/>

		<div class="input-group">
			<label for="website">Website</label>
			<input type="url" id="website" name="website" value={account.website} />
		</div>

		<button class="button" type="submit">Update Profile</button>
	</form>

	{#if form?.error && form.action == 'edit'}
		<Message type="error">
			{form.error}
		</Message>
	{/if}

	{#if form?.message && form.action === 'edit'}
		<Message type="success">
			{form.message}
		</Message>
	{/if}
</section>

<section>
	<h3>Settings</h3>

	<form action="?/settings" method="POST" use:enhance>
		<div class="check-group">
			<label for="like_notifications">Like Notifications</label>
			<input
				type="checkbox"
				id="like_notifications"
				name="like_notifications"
				checked={account.like_notifications_enabled}
			/>
		</div>

		<div class="check-group">
			<label for="reply_notifications">Reply Notifications</label>
			<input
				type="checkbox"
				id="reply_notifications"
				name="reply_notifications"
				checked={account.reply_notifications_enabled}
			/>
		</div>

		<div class="check-group">
			<label for="follow_notifications">Follow Notifications</label>
			<input
				type="checkbox"
				id="follow_notifications"
				name="follow_notifications"
				checked={account.follow_notifications_enabled}
			/>
		</div>

		<button class="button" type="submit">Update Settings</button>
	</form>

	{#if form?.error && form.action == 'settings'}
		<Message type="error">
			{form.error}
		</Message>
	{/if}

	{#if form?.message && form.action === 'settings'}
		<Message type="success">
			{form.message}
		</Message>
	{/if}
</section>

<section>
	<h3>Security</h3>

	<form action="?/password" method="POST" use:enhance>
		<div class="input-group">
			<label for="old_password">Old Password</label>
			<input type="password" id="old_password" name="old_password" required />
		</div>

		<div class="input-group">
			<label for="new_password">New Password</label>
			<input type="password" id="new_password" name="new_password" required />
		</div>

		<button class="button" type="submit">Change Password</button>
	</form>

	{#if form?.error && form.action == 'password'}
		<Message type="error">
			{form.error}
		</Message>
	{/if}

	{#if form?.message && form.action === 'password'}
		<Message type="success">
			{form.message}
		</Message>
	{/if}
</section>

<section>
	<h3>Manage Account</h3>

	<div class="account-options">
		<button class="button" onclick={delete_account}>Delete account</button>

		<form action="?/logout" method="POST" use:enhance>
			<button class="button">Logout</button>
		</form>
	</div>
</section>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
	}

	.profile-link {
		margin-left: auto;
	}

	.handle {
		color: var(--primary-color);
	}

	section {
		margin-bottom: 2rem;
	}

	section h3 {
		margin-bottom: 1rem;
	}

	.image-container {
		margin-bottom: 1rem;
	}

	.placeholder,
	.avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
	}

	.placeholder {
		background-color: var(--secondary-bg-color);
	}

	.account-options {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}
</style>
