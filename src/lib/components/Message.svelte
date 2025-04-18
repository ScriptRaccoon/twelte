<script lang="ts">
	import {
		faCircleCheck,
		faCircleExclamation,
		faInfoCircle,
		faTriangleExclamation
	} from '@fortawesome/free-solid-svg-icons'
	import type { Snippet } from 'svelte'

	import Fa from 'svelte-fa'

	type Props = {
		children: Snippet
		type: 'success' | 'info' | 'warning' | 'error'
	}

	const icons = {
		info: faInfoCircle,
		success: faCircleCheck,
		warning: faTriangleExclamation,
		error: faCircleExclamation
	} as const

	let { children, type }: Props = $props()
</script>

<div class={type}>
	<span><Fa icon={icons[type]} /></span>

	{@render children?.()}
</div>

<style>
	div {
		margin-block: 1.5rem;
		background-color: var(--msg-color, transparent);
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
	}

	span {
		margin-right: 0.25rem;
	}

	div.info {
		--msg-color: var(--secondary-bg-color);
	}

	div.success {
		--msg-color: rgb(21, 94, 21);
	}

	div.warning {
		--msg-color: rgb(152, 135, 23);
	}

	div.error {
		--msg-color: rgb(117, 11, 11);
	}
</style>
