<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import Message from '$lib/components/Message.svelte'

	let { form } = $props()

	const code = page.url.searchParams.get('code')

	let submitting = $state(false)

	function handle_submit(e: SubmitEvent) {
		if (submitting) e.preventDefault()
		submitting = true
	}

	$effect(() => {
		if (form) submitting = false
	})
</script>

<svelte:head>
	<title>Twelte - Login</title>
</svelte:head>

<header class="page-header">
	<h2>Login</h2>
</header>

{#if code === 'email_verified'}
	<Message type="success">Your email has been verified. You can now login.</Message>
{:else if code === 'password_reset'}
	<Message type="success">Your password has been reset. You can now login.</Message>
{/if}

<form method="POST" use:enhance onsubmit={handle_submit}>
	<div class="input-group">
		<label for="handle">Handle</label>
		<input type="text" id="handle" name="handle" required value={form?.handle} />
	</div>

	<div class="input-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<button class="button" type="submit" disabled={submitting} class:loading={submitting}>
		{#if submitting}
			Login...
		{:else}
			Login
		{/if}
	</button>
</form>

{#if form?.error && !submitting}
	<Message type="error">
		{form.error}
	</Message>
{/if}

<div class="message secondary">
	In case you've forgotten your password, you can <a href="/account/reset">reset it here</a>.
</div>

<style>
	.message {
		margin-top: 1rem;
	}
</style>
