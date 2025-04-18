<script lang="ts">
	import type { IconDefinition as IconDefinitionRegular } from '@fortawesome/free-regular-svg-icons'
	import type { IconDefinition as IconDefinitionSolid } from '@fortawesome/free-solid-svg-icons'
	import type { Snippet } from 'svelte'
	import Fa from 'svelte-fa'

	type Props = {
		icon: IconDefinitionRegular | IconDefinitionSolid
		children?: Snippet
		onclick: () => void
		aria_label?: string
		disabled?: boolean
		color?: string
		small?: boolean
	}

	let {
		icon,
		children,
		onclick,
		aria_label = '',
		disabled = false,
		color = 'currentColor',
		small = false
	}: Props = $props()
</script>

<button {onclick} aria-label={aria_label} {disabled} class:small>
	<Fa {icon} {color} />
	{@render children?.()}
</button>

<style>
	button {
		cursor: pointer;
		background-color: var(--secondary-bg-color);
		padding: 0.1rem 0.6rem;
		border-radius: 0.25rem;
	}

	button:disabled {
		cursor: initial;
	}

	button.small {
		padding: 0rem 0.4rem;
		font-size: 0.825rem;
	}
</style>
