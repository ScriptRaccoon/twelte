<script lang="ts">
	import PostList from '$lib/components/PostList.svelte'

	let { data } = $props()
</script>

<h1>Twelte</h1>

<menu>
	<a href="/post/create">Create New Post</a>
</menu>

<PostList initial_posts={data.posts} limit={data.limit} user_id={data.user?.id} />
