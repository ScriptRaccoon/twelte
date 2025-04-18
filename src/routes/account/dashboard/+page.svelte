<script lang="ts">
	import { enhance } from '$app/forms'
	import InfoMessage from '$lib/components/InfoMessage.svelte'

	let { data, form } = $props()
	let account = $derived(data.account)

	let confirm_deletion = $state(false)
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
			<label for="display_name">Display Name</label>
			<input type="text" id="display_name" name="display_name" value={account.display_name} />
		</div>

		<div class="input-group">
			<label for="bio">Bio</label>
			<textarea id="bio" name="bio" rows="3">{account.bio}</textarea>
		</div>

		<button class="button" type="submit">Update Profile</button>
	</form>

	{#if form?.error && form.action == 'edit'}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.action === 'edit'}
		<InfoMessage>
			{form.message}
		</InfoMessage>
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
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.message && form.action === 'password'}
		<InfoMessage>
			{form.message}
		</InfoMessage>
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
		<p class="error">Are you sure? This cannot be undone!</p>
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
</style>
