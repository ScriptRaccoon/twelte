<script lang="ts">
	import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

	import Fa from 'svelte-fa'

	let { children } = $props()
</script>

<div>
	<span>
		<Fa icon={faInfoCircle} />
	</span>

	{@render children?.()}
</div>

<style>
	div {
		margin-block: 1.5rem;
		background-color: rgb(21, 94, 21);
		padding: 0.5rem 1rem;
		border-radius: 0.25rem;
	}

	span {
		margin-right: 0.25rem;
	}
</style>
