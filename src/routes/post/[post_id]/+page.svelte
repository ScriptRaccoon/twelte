<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'
	import Post from '$lib/components/Post.svelte'
	import PostList from '$lib/components/PostList.svelte'

	let { data, form } = $props()
	let post = $derived(data.post)
	let replies = $derived(data.replies)
</script>

<svelte:head>
	<title>Twelte - Post by @{post.author_handle}</title>
</svelte:head>

{#if post.parent_id}
	<a href="/post/{post.parent_id}"> Back to Parent Post </a>
{/if}

<h2>Post by @{post.author_handle}</h2>

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
	<!-- TODO: add styles -->
	<form action="?/reply" method="POST" use:enhance>
		<textarea name="content" rows="4" cols="50" placeholder="Write your reply here..." required
		></textarea>

		<p>
			<button type="submit">Reply</button>
		</p>
	</form>

	{#if form?.error}
		<Message type="error">
			{form.error}
		</Message>
	{/if}

	{#if form?.success}
		<Message type="success">Reply has been sent.</Message>
	{/if}
{/if}

{#if replies.length}
	<h3>Replies</h3>

	<PostList initial_posts={replies} user_id={data.user?.id} />
{/if}
