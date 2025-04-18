<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'
	let { form } = $props()

	let content = $state('')
</script>

<svelte:head>
	<title>Twelte - Create Post</title>
</svelte:head>

<h2>Share your thoughts</h2>

<form method="POST" use:enhance class="form">
	<div class="input-group">
		<textarea
			aria-label="post content"
			name="content"
			rows="5"
			required
			bind:value={content}
			aria-invalid={content.length > 280}
		></textarea>
		<div class="small">
			{content.length}/280 characters
		</div>
	</div>
	<button class="button" type="submit">Create Post</button>
</form>

{#if form?.error}
	<Message type="error">
		{form.error}
	</Message>
{/if}

<style>
	.small {
		float: right;
	}
</style>
