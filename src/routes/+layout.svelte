<script lang="ts">
	import './app.css';

	let { data, children } = $props();
	let user = $derived(data.user);
</script>

<nav>
	<ul>
		<li>
			<a href="/">Home</a>
		</li>
		{#if user}
			<li>
				<a href="/profile/{user.handle}"> Profile </a>
			</li>
			<li>
				<a href="/account/dashboard">Account</a>
			</li>
		{:else}
			<li>
				<a href="/account/create">Create Account</a>
			</li>
			<li>
				<a href="/account/login">Login</a>
			</li>
		{/if}
	</ul>
</nav>

{@render children?.()}

<style>
	ul {
		list-style: none;
		display: flex;
		gap: 1rem;
	}
</style>
