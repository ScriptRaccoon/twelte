<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'

	let { form } = $props()
</script>

<header class="page-header">
	<h2>New Password</h2>
</header>

<form method="POST" use:enhance>
	<div class="input-group">
		<label for="password">New Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<div class="input-group">
		<label for="confirm_password">Confirm Password</label>
		<input type="password" id="confirm_password" name="confirm_password" required />
	</div>

	<button class="button">Submit</button>
</form>

{#if form?.error}
	<Message type="error">
		{form.error}
	</Message>
{/if}
