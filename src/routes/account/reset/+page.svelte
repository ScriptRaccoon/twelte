<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'

	let { form } = $props()
</script>

<header class="page-header">
	<h2>Reset Password</h2>
</header>

<form method="POST" use:enhance>
	<div class="input-group">
		<label for="email">Email</label>
		<input type="email" id="email" name="email" required value={form?.email} />
	</div>

	<button class="button">Submit</button>
</form>

{#if form?.error}
	<Message type="error">
		{form.error}
	</Message>
{/if}

{#if form?.success}
	<Message type="success">Email has been sent.</Message>
{/if}
