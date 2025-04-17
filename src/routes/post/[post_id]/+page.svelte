<script lang="ts">
	import { enhance } from '$app/forms'

	let { data, form } = $props()
	let post = $derived(data.post)
	let replies = $derived(data.replies)
</script>

<h1>Post</h1>

<!-- TODO: reuse Post component, make it more adjustable . . . -->

<p>
	<strong>
		<a href="/profile/{post.author_handle}">@{post.author_handle}</a>
	</strong>
	&ndash;
	{new Date(post.created_at).toLocaleString()}
</p>

<p>{post.content}</p>

<h2>Your Reply</h2>

{#if data.user}
	<form action="?/reply" method="POST" use:enhance>
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

{#if replies.length}
	<h2>Replies</h2>
	{#each replies as reply}
		<p>
			<strong>
				<a href="/profile/{reply.author_handle}">@{reply.author_handle}</a>
			</strong>
			&ndash;
			{new Date(reply.created_at).toLocaleString()}
		</p>

		<p>{reply.content}</p>
	{/each}
{/if}
