<script lang="ts">
	import { enhance } from '$app/forms'
	let { form } = $props()
</script>

<h1>Create New Post</h1>

<form method="POST" use:enhance>
	<label for="content">Content</label>
	<textarea id="content" name="content" rows="4" cols="50" required
		>{form?.content ?? ''}</textarea
	>

	<p>
		<button type="submit">Create Post</button>
	</p>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
