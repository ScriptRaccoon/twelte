<script lang="ts">
	import { enhance } from '$app/forms'

	let { data, form } = $props()
</script>

<h1>Post Page for {data.post_id} (WIP)</h1>

{#if data.user}
	<form action="?/reply" method="POST" use:enhance>
		<input type="hidden" name="post_id" value={data.post_id} />
		<textarea name="content" rows="4" cols="50" placeholder="Write your reply here..." required
		></textarea>

		<p>
			<button type="submit">Reply</button>
		</p>
	</form>

	{#if form?.error}
		<p class="error">{form.error}</p>
	{/if}

	{#if form?.success}
		<p>Reply has been sent!</p>
	{/if}
{/if}
