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

<h2>Login</h2>

{#if code === 'email_verified'}
	<Message type="success">Your email has been verified. You can now login.</Message>
{/if}

<form method="POST" use:enhance class="form" onsubmit={handle_submit}>
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
