<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import Message from '$lib/components/Message.svelte'

	let { form } = $props()

	const code = page.url.searchParams.get('code')
</script>

<svelte:head>
	<title>Twelte - Login</title>
</svelte:head>

<h2>Login</h2>

{#if code === 'email_verified'}
	<Message type="success">Your email has been verified. You can now login.</Message>
{/if}

<form method="POST" use:enhance class="form">
	<div class="input-group">
		<label for="handle">Handle</label>
		<input type="text" id="handle" name="handle" required value={form?.handle} />
	</div>

	<div class="input-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<button class="button" type="submit">Login</button>
</form>

{#if form?.error}
	<Message type="error">
		{form.error}
	</Message>
{/if}
