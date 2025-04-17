<script lang="ts">
	import Fa from 'svelte-fa'
	import './app.css'
	import { faHome, faSliders, faTools, faUserAlt } from '@fortawesome/free-solid-svg-icons'

	let { data, children } = $props()
	let user = $derived(data.user)
</script>

<nav>
	<ul>
		<li>
			<a href="/">
				<Fa icon={faHome} /> Home
			</a>
		</li>
		{#if user}
			<li>
				<a href="/profile/{user.handle}">
					<Fa icon={faUserAlt} /> Profile
				</a>
			</li>
			<li>
				<a href="/account/dashboard">
					<Fa icon={faSliders} /> Account
				</a>
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
