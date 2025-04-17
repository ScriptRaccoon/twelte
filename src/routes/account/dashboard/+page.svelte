<script lang="ts">
	import { enhance } from '$app/forms'

	let { data, form } = $props()
	let account = $derived(data.account)

	let confirm_deletion = $state(false)
</script>

<h1>Account Page</h1>

{#if !form && data.message}
	<p>{data.message}</p>
{/if}

<p>Handle: @{account.handle}</p>

<form action="?/edit" method="POST" use:enhance>
	<label for="email">Email</label>
	<input type="email" id="email" name="email" value={account.email} />

	<label for="display_name">Display Name</label>
	<input type="text" id="display_name" name="display_name" value={account.display_name} />

	<label for="bio">Bio</label>
	<textarea id="bio" name="bio" rows="4" cols="50">{account.bio}</textarea>

	<p>
		<button type="submit">Update Profile</button>
	</p>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<form action="?/logout" method="POST" use:enhance>
	<p>
		<button>Logout</button>
	</p>
</form>

<form action="?/delete" method="POST" use:enhance>
	<p>
		{#if confirm_deletion}
			<button type="submit">Yes! Delete account</button>
		{:else}
			<button
				type="button"
				onclick={() => {
					confirm_deletion = true
				}}>Delete account</button
			>
		{/if}
	</p>
	{#if confirm_deletion}
		Are you sure? This cannot be undone! All your data will be lost!
	{/if}
</form>
