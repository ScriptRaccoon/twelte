<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<h1>Create an account</h1>

<form method="POST" action="?/register" use:enhance>
	<label for="email">Email</label>
	<input type="email" id="email" name="email" required />

	<label for="handle">Handle</label>
	<input type="text" id="handle" name="handle" required />

	<label for="password">Password</label>
	<input type="password" id="password" name="password" required />

	<button type="submit">Create Account</button>

	<p>Notice that the handle cannot be changed anymore after registration.</p>
</form>

{#if form?.success}
	<p>User has been created. You can now login.</p>
{/if}
