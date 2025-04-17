<script lang="ts">
	import type { Post as PostType } from '$lib/types'
	import Post from './Post.svelte'

	type Props = {
		initial_posts: PostType[]
		limit: number
		profile_id?: number // defined when on profile page
		user_id?: number // defined when authenticated
	}

	let { initial_posts, limit, profile_id, user_id }: Props = $props()

	let posts = $state(initial_posts)

	let offset = $state(0)

	let loaded_all_posts = $state(false)

	async function load_more() {
		if (loaded_all_posts) return

		offset += limit

		const url = profile_id
			? `/api/posts?user_id=${profile_id}&limit=${limit}&offset=${offset}`
			: `/api/posts?limit=${limit}&offset=${offset}`

		const res = await fetch(url)

		if (!res.ok) {
			console.error('Failed to load more posts')
			return
		}
		const new_posts: PostType[] = await res.json()

		posts = [...posts, ...new_posts]

		if (!new_posts.length) {
			loaded_all_posts = true
		}
	}
</script>

<h2>Posts</h2>

{#if posts?.length}
	<div>
		{#each posts as post (post.id)}
			<Post {post} is_owner={post.user_id === user_id} authenticated={!!user_id} />
		{/each}
	</div>

	{#if !loaded_all_posts}
		<!-- TODO: load when last post comes into view, remove button -->
		<p>
			<button onclick={load_more}>Load More Posts</button>
		</p>
	{:else}
		<p>These are all posts.</p>
	{/if}
{:else}
	<p>No posts yet.</p>
{/if}
