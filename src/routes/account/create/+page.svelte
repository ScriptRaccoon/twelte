<script lang="ts">
	import { enhance } from '$app/forms'
	import InfoMessage from '$lib/components/InfoMessage.svelte'
	import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	let { form } = $props()
</script>

<h2>Create an account</h2>

<form method="POST" action="?/register" use:enhance class="form">
	<div class="input-group">
		<label for="email">Email</label>
		<input
			type="email"
			id="email"
			name="email"
			required
			value={form?.email}
			readonly={form?.success}
		/>
	</div>
	<div class="input-group">
		<label for="handle">Handle*</label>
		<input
			type="text"
			id="handle"
			name="handle"
			required
			value={form?.handle}
			readonly={form?.success}
		/>
	</div>
	<div class="input-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required readonly={form?.success} />
	</div>

	<button class="button" type="submit" disabled={form?.success}>Create Account</button>
</form>

<p>*Notice that the handle cannot be changed anymore after registration.</p>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

{#if form?.success}
	<InfoMessage>
		Account has been created. You can now
		<a href="/account/login">login</a>.
	</InfoMessage>
{/if}
