<script lang="ts">
	import { enhance } from '$app/forms'
	import Message from '$lib/components/Message.svelte'
	import TextareaWithLimit from '$lib/components/TextareaWithLimit.svelte'
	import { MAX_POST_LENGTH } from '$lib/config'
	let { form } = $props()
</script>

<svelte:head>
	<title>Twelte - New Post</title>
</svelte:head>

<header class="page-header">
	<h2>New Post</h2>
</header>

<form method="POST" use:enhance>
	<TextareaWithLimit
		aria_label="post content"
		placeholder="Your thoughts ..."
		name="content"
		limit={MAX_POST_LENGTH}
		show_hashtags={true}
	/>
	<button class="button" type="submit">Create Post</button>
</form>

{#if form?.error}
	<Message type="error">
		{form.error}
	</Message>
{/if}
