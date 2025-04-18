<script lang="ts">
	import './app.css'
	import Header from '$lib/components/Header.svelte'

	let { data, children } = $props()
</script>

<div class="wrapper">
	<Header user={data.user} />

	{@render children?.()}
</div>
