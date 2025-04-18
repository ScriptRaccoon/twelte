<script lang="ts">
	import { enhance } from '$app/forms'
	let { form } = $props()

	let content = $state('')
</script>

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
		<div class="description">
			{content.length}/280 characters
		</div>
	</div>
	<button class="button" type="submit">Create Post</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}

<style>
	.description {
		float: right;
	}
</style>
