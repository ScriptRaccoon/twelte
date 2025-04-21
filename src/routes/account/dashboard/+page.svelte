<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'
	import Textarea from '$lib/components/TextareaWithLimit.svelte'
	import { MAX_BIO_LENGTH } from '$lib/config'
	import type { AccountData } from '$lib/types'

	let { data, form } = $props()
	let account: AccountData = $derived(data.account)

	let confirm_deletion = $state(false)

	let files: FileList | null = $state(null)
	let avatar_form: HTMLFormElement | null = $state(null)

	$effect(() => {
		if (files?.length) avatar_form?.submit()
	})
</script>

<svelte:head>
	<title>Twelte - Account @{account.handle}</title>
</svelte:head>

<header>
	<h2>
		Account &nbsp;
		<span class="handle">@{account.handle}</span>
	</h2>

	<form action="?/logout" method="POST" use:enhance class="form">
		<button class="button">Logout</button>
	</form>
</header>

<section aria-label="avatar">
	<form
		bind:this={avatar_form}
		action="?/avatar"
		method="POST"
		use:enhance
		enctype="multipart/form-data"
		class="avatar-form"
	>
		<div>
			{#if account.avatar_url}
				<img src={account.avatar_url} alt="Avatar" class="avatar" />
			{:else}
				<div class="placeholder"></div>
			{/if}
		</div>

		<div>
			<label for="avatar" class="button">
				{#if account.avatar_url}
					Update avatar
				{:else}
					Choose avatar
				{/if}
			</label>
			<input
				type="file"
				name="avatar"
				id="avatar"
				accept="image/*"
				class="sr-only"
				bind:files
			/>
		</div>
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
	<form action="?/edit" method="POST" class="form">
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

	<form action="?/settings" method="POST" use:enhance class="form">
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

	<form action="?/password" method="POST" use:enhance class="form">
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
	<h3>Danger Zone</h3>

	<form action="?/delete" method="POST" use:enhance class="form">
		{#if confirm_deletion}
			<button class="button" type="submit">Yes! Delete account</button>
			<button
				class="button"
				type="button"
				onclick={() => {
					confirm_deletion = false
				}}>Cancel</button
			>
		{:else}
			<button
				class="button"
				type="button"
				onclick={() => {
					confirm_deletion = true
				}}
			>
				Delete account
			</button>
		{/if}
	</form>

	{#if confirm_deletion}
		<Message type="warning">Are you sure? This cannot be undone!</Message>
	{/if}
</section>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	.handle {
		color: var(--primary-color);
		font-size: 1rem;
		font-weight: 400;
	}

	section {
		margin-bottom: 2rem;
	}

	.small {
		float: right;
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

	.avatar-form {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
</style>
