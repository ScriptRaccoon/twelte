<script lang="ts">
	import type { IconDefinition as IconDefinitionRegular } from '@fortawesome/free-regular-svg-icons'
	import type { IconDefinition as IconDefinitionSolid } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	type Props = {
		href: string
		icon: IconDefinitionRegular | IconDefinitionSolid
		label: string
		variant?: 'normal' | 'small'
	}

	let { href, icon, label, variant = 'normal' }: Props = $props()
</script>

<a {href} aria-label={label} class="v-{variant}">
	<Fa {icon} /><span class="link-label">{label}</span>
</a>

<style>
	a {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 0.25rem;
		background-color: var(--secondary-bg-color);
		text-decoration: none;
		--distance: 0.4rem;
	}

	.link-label {
		margin-left: var(--distance);
	}

	a.v-small {
		padding: 0.1rem 0.6rem;
		--distance: 0.25rem;
	}
</style>
