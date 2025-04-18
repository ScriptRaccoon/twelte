<script lang="ts">
	import Message from '$lib/components/Message.svelte'
	import Post from '$lib/components/Post.svelte'
	import PostList from '$lib/components/PostList.svelte'

	let { data, form } = $props()
	let post = $derived(data.post)
	let replies = $derived(data.replies)

	let reply_content = $state('')
</script>

<svelte:head>
	<title>Twelte - Post by @{post.author_handle}</title>
</svelte:head>

<section>
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
</section>

{#if data.user}
	<section>
		<h3 id="reply-title">Your Reply</h3>

		<form action="?/reply" method="POST">
			<div class="input-group">
				<textarea
					name="content"
					rows="4"
					placeholder="Write your reply here..."
					aria-labelledby="reply-title"
					aria-invalid={reply_content.length > 280}
					bind:value={reply_content}
					required
				></textarea>
				<div class="small">
					{reply_content.length}/280 characters
				</div>
			</div>

			<button class="button" type="submit">Reply</button>
		</form>

		{#if form?.error}
			<Message type="error">
				{form.error}
			</Message>
		{/if}

		{#if form?.success}
			<Message type="success">Reply has been sent.</Message>
		{/if}
	</section>
{/if}

{#if replies.length}
	<section>
		<h3>Replies</h3>

		<PostList initial_posts={replies} user_id={data.user?.id} />
	</section>
{/if}

<style>
	section {
		margin-bottom: 2rem;
	}

	.small {
		float: right;
	}
</style>
