<script lang="ts">
	import PostList from '$lib/components/PostList.svelte'

	let { data } = $props()
</script>

<h2>Feed</h2>

<PostList initial_posts={data.posts} limit={data.limit} user_id={data.user?.id} />
