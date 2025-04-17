<script lang="ts">
	import './app.css';
</script>

<nav>
	<ul>
		<li>
			<a href="/">Home</a>
		</li>
		<li>
			<a href="/account/create">Create Account</a>
		</li>
		<li>
			<a href="/account/login">Login</a>
		</li>
		<li>
			<a href="/account/dashboard">Account Page</a>
		</li>
	</ul>
</nav>

<slot></slot>

<style>
	ul {
		list-style: none;
		display: flex;
		gap: 1rem;
	}
</style>
