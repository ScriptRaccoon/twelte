<script lang="ts">
	import type { Post as PostType } from '$lib/types'
	import Post from './Post.svelte'

	type Props = {
		initial_posts: PostType[]
		limit?: number
		author_id?: number // defined when on profile page
		user_id?: number // defined when authenticated
	}

	let { initial_posts, limit, author_id, user_id }: Props = $props()

	let posts = $state(initial_posts)

	let offset = $state(0)

	let has_loaded_all_posts = $state(false)

	let is_loading = $state(false)

	async function load_more() {
		if (!limit) return
		if (is_loading || has_loaded_all_posts) return
		is_loading = true

		offset += limit

		const url = author_id
			? `/api/posts/profile/${author_id}?limit=${limit}&offset=${offset}`
			: `/api/posts?limit=${limit}&offset=${offset}`

		const res = await fetch(url)

		if (!res.ok) {
			console.error('Failed to load more posts')
			is_loading = false
			return
		}
		const new_posts: PostType[] = await res.json()

		posts = [...posts, ...new_posts]

		if (!new_posts.length) {
			has_loaded_all_posts = true
		}

		is_loading = false
	}

	function load_more_when_visible(node: HTMLDivElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						load_more()
					}
				})
			},
			{ threshold: 1 }
		)

		observer.observe(node)
	}

	function handle_deletion(post_id: number) {
		posts = posts.filter((post) => post.id !== post_id)
	}
</script>

{#if posts?.length}
	{#each posts as post, index (post.id)}
		<div class="post-wrapper" class:first={index === 0}>
			<Post
				{post}
				is_author={post.author_id === user_id}
				authenticated={!!user_id}
				handle_deletion={() => handle_deletion(post.id)}
			/>
		</div>
	{/each}

	{#if limit}
		<div use:load_more_when_visible class="observer"></div>
	{/if}

	{#if is_loading && limit}
		<p class="secondary">Loading more posts ...</p>
	{/if}

	{#if has_loaded_all_posts && limit}
		<p class="secondary">These are all posts.</p>
	{/if}
{:else}
	<p class="secondary">No posts yet.</p>
{/if}

<style>
	.observer {
		width: 100%;
		height: 1px;
		pointer-events: none;
		translate: 0 -20px;
	}

	.post-wrapper {
		padding-block: 1rem;
		border-bottom: 1px solid #333;
	}

	.post-wrapper.first {
		border-top: 1px solid #333;
	}
</style>
