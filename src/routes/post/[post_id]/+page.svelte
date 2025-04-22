<script lang="ts">
	import { goto } from '$app/navigation'
	import Message from '$lib/components/Message.svelte'
	import Post from '$lib/components/Post.svelte'
	import PostList from '$lib/components/PostList.svelte'
	import TextareaWithLimit from '$lib/components/TextareaWithLimit.svelte'
	import { MAX_POST_LENGTH } from '$lib/config.js'

	let { data, form } = $props()
	let post = $derived(data.post)
	let replies = $derived(data.replies)
</script>

<svelte:head>
	<title>Twelte - Post by {post.author_name}</title>
</svelte:head>

<section>
	<header class="page-header">
		{#if post.parent_id}
			<a href="/post/{post.parent_id}"> Back to Parent Post </a>
		{/if}
		<h2>Post by {post.author_name}</h2>
	</header>

	<Post
		{post}
		is_author={data.user?.id === post.author_id}
		authenticated={!!data.user}
		handle_deletion={() => goto('/')}
	/>
</section>

{#if data.user}
	<section>
		<h3>Your Reply</h3>

		<form action="?/reply" method="POST">
			<TextareaWithLimit
				name="content"
				placeholder="Write your reply here..."
				aria_label="reply content"
				limit={MAX_POST_LENGTH}
				initial_content={form?.content ?? ''}
				show_hashtags={true}
			/>

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
	header {
		display: grid;
		gap: 0.5rem;
	}
	section {
		margin-bottom: 2rem;
	}

	section h3 {
		margin-bottom: 0.5rem;
	}
</style>
