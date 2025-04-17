<script lang="ts">
	import PostList from '$lib/components/PostList.svelte'
	import { faPencil } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	let { data } = $props()
</script>

<h1>Twelte</h1>

<menu>
	<a href="/post/create">
		<Fa icon={faPencil} />
		Create New Post
	</a>
</menu>

<PostList initial_posts={data.posts} limit={data.limit} user_id={data.user?.id} />
