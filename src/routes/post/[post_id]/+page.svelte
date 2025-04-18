<script lang="ts">
	import { enhance } from '$app/forms'
	import Post from '$lib/components/Post.svelte'
	import PostList from '$lib/components/PostList.svelte'

	let { data, form } = $props()
	let post = $derived(data.post)
	let replies = $derived(data.replies)
</script>

<h2>Post Detail Page</h2>

{#if post.parent_id}
	<a href="/post/{post.parent_id}"> Back to Parent Post </a>
{/if}

<h3>Post</h3>

<Post
	{post}
	is_author={data.user?.id === post.author_id}
	authenticated={!!data.user}
	handle_deletion={() => {
		window.history.back()
	}}
/>

<h3>Your Reply</h3>

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
	<h3>Replies</h3>

	<PostList initial_posts={replies} user_id={data.user?.id} />
{/if}
