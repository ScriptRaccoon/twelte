<script lang="ts">
	let { data } = $props();
	let posts = $derived(data.posts);
</script>

<h1>Twelte</h1>

<menu>
	<a href="/post/create">Create New Post</a>
</menu>

<h2>Posts</h2>

{#if posts?.length}
	<div>
		{#each posts as post (post.id)}
			<div class="post">
				<strong>@{post.user_handle}</strong>
				<br />
				<div>{post.content}</div>
				<menu>
					<button>Like</button>
					{#if post.user_id === data.user?.id}
						<button>Delete</button>
					{/if}
				</menu>
			</div>
		{/each}
	</div>
{:else}
	<p>No posts yet.</p>
{/if}

<style>
	.post {
		margin-bottom: 1rem;
		width: 280px;
	}
</style>
