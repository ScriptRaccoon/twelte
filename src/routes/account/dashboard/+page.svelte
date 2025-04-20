<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'
	import type { AccountData } from '$lib/types'

	let { data, form } = $props()
	let account: AccountData = $derived(data.account)

	let confirm_deletion = $state(false)

	// svelte-ignore state_referenced_locally
	let bio_content = $state(account.bio)
</script>

<svelte:head>
	<title>Twelte - Account @{account.handle}</title>
</svelte:head>

<header>
	<h2>Account</h2>
	<form action="?/logout" method="POST" use:enhance class="form">
		<button class="button">Logout</button>
	</form>
</header>

<section aria-label="basic information">
	<p class="handle" aria-label="handle">@{account.handle}</p>

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

		<div class="input-group">
			<label for="bio">Bio</label>
			<textarea
				id="bio"
				name="bio"
				rows="3"
				bind:value={bio_content}
				aria-invalid={bio_content.length > 160}>{account.bio}</textarea
			>
			<div class="small">{bio_content.length}/160 characters</div>
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
	.handle {
		color: var(--primary-color);
	}

	header {
		display: flex;
		justify-content: space-between;
	}

	section {
		margin-bottom: 2rem;
	}

	.small {
		float: right;
	}
</style>
