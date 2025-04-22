<script lang="ts">
	import type { IconDefinition as IconDefinitionRegular } from '@fortawesome/free-regular-svg-icons'
	import type { IconDefinition as IconDefinitionSolid } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'

	type Props = {
		href: string
		icon: IconDefinitionRegular | IconDefinitionSolid
		label: string
	}

	let { href, icon, label }: Props = $props()
</script>

<a {href} aria-label={label}>
	<Fa {icon} /> <span class="link-label">{label}</span>
</a>

<style>
	a {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 0.25rem;
		background-color: var(--secondary-bg-color);
		text-decoration: none;
	}

	.link-label {
		margin-left: 0.25rem;
	}
</style>
