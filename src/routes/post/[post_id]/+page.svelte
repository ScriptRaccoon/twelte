<script lang="ts">
	import { enhance } from '$app/forms'
	import Post from '$lib/components/Post.svelte'
	import PostList from '$lib/components/PostList.svelte'

	let { data, form } = $props()
	let post = $derived(data.post)
	let replies = $derived(data.replies)
</script>

<h1>Post Detail Page</h1>

{#if post.parent_id}
	<a href="/post/{post.parent_id}"> Back to Parent Post </a>
{/if}

<h2>Post</h2>

<Post
	{post}
	is_author={data.user?.id === post.author_id}
	authenticated={!!data.user}
	handle_deletion={() => {
		window.history.back()
	}}
/>

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

	<PostList initial_posts={replies} user_id={data.user?.id} />
{/if}
