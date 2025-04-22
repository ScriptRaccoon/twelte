<script lang="ts">
	import PostList from '$lib/components/PostList.svelte'

	let { data } = $props()
</script>

<svelte:head>
	<title>Twelte - #{data.tag}</title>
</svelte:head>

{#key data.tag}
	<header class="page-header">
		<h2>Posts with #{data.tag}</h2>
	</header>

	<PostList
		initial_posts={data.posts}
		user_id={data.user?.id}
		limit={data.limit}
		fetch_more_url="/api/posts/hashtag/{data.tag}"
	/>
{/key}
