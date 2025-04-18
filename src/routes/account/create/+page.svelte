<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'

	let { form } = $props()
</script>

<svelte:head>
	<title>Twelte - Create Account</title>
</svelte:head>

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
	<Message type="error">
		{form.error}
	</Message>
{/if}

{#if form?.success}
	<Message type="success">
		Account has been created. We have sent you a verification email. Please click on the link in
		the email to verify your account. After that, you can <a href="/account/login">login</a>.
	</Message>
{/if}
