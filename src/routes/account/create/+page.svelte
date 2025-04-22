<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'

	let { form } = $props()

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
	<title>Twelte - Create Account</title>
</svelte:head>

<header class="page-header">
	<h2>Create an account</h2>
</header>

<form method="POST" action="?/register" use:enhance onsubmit={handle_submit}>
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

	<button
		class="button"
		type="submit"
		disabled={submitting || form?.success}
		class:loading={submitting}
	>
		{#if submitting}
			Creating account...
		{:else}
			Create account
		{/if}
	</button>
</form>

<p>*Notice that the handle cannot be changed anymore after registration.</p>

{#if form?.error && !submitting}
	<Message type="error">
		{form.error}
	</Message>
{/if}

{#if form?.success && !submitting}
	<Message type="success">
		Account has been created. We have sent you a verification email. Please click on the link in
		the email to verify your account. After that, you can <a href="/account/login">login</a>.
	</Message>
{/if}

<style>
	form {
		margin-bottom: 1rem;
	}
</style>
