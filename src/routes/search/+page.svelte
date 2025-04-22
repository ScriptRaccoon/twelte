<script>
	import IconButton from '$lib/components/IconButton.svelte'
	import { faSearch } from '@fortawesome/free-solid-svg-icons'
</script>

<header class="page-header">
	<h2>Search</h2>
</header>

<form method="GET">
	<div class="input-group">
		<label for="search">Search</label>
		<div class="bar">
			<input type="search" name="query" id="search" required />
			<IconButton icon={faSearch} />
		</div>
	</div>
</form>

<style>
	.bar {
		display: flex;
		gap: 0.5rem;
	}
</style>
