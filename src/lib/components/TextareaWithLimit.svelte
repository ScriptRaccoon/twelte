<script lang="ts">
	import { extract_hashtags } from '$lib/utils'

	type Props = {
		placeholder?: string
		limit: number
		name: string
		aria_label: string
		rows?: number
		label?: string
		initial_content?: string
		show_hashtags?: boolean
	}

	let {
		placeholder = '',
		name,
		limit,
		aria_label,
		rows = 4,
		label,
		initial_content = '',
		show_hashtags = false
	}: Props = $props()

	let content = $state(initial_content)

	const id = name + Math.random().toString(36).substring(2, 9)
</script>

<div class="input-group">
	{#if label}
		<label for={id}>{label}</label>
	{/if}
	<textarea
		{id}
		{name}
		{rows}
		{placeholder}
		aria-invalid={content.length > limit}
		aria-label={aria_label}
		bind:value={content}
		required
	></textarea>
	<div class="small">
		{content.length}/{limit} characters
	</div>

	{#if show_hashtags}
		<div class="hashtags">
			{#each extract_hashtags(content) as tag}
				<span>#{tag}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.small {
		float: right;
	}

	.hashtags {
		display: flex;
		gap: 0.25rem;
		flex-wrap: wrap;
		color: var(--primary-color);
	}
</style>
