<script lang="ts">
	import { enhance } from '$app/forms'
	import InfoMessage from '$lib/components/InfoMessage.svelte'

	let { data, form } = $props()
	let account = $derived(data.account)

	let confirm_deletion = $state(false)
</script>

<header>
	<h2>Account</h2>
	<form action="?/logout" method="POST" use:enhance class="form">
		<button class="button">Logout</button>
	</form>
</header>

<p class="handle" aria-label="handle">@{account.handle}</p>

<form action="?/edit" method="POST" use:enhance class="form">
	<div class="input-group">
		<label for="email">Email</label>
		<input type="email" id="email" name="email" value={account.email} />
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

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if !form && data.message}
	<InfoMessage>
		{data.message}
	</InfoMessage>
{/if}

<h3>Danger Zone</h3>

<form action="?/delete" method="POST" use:enhance class="form">
	{#if confirm_deletion}
		<button class="button" type="submit">Yes! Delete account</button>
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

<style>
	.handle {
		color: var(--primary-color);
	}

	header {
		display: flex;
		justify-content: space-between;
	}
</style>
