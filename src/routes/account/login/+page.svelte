<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<h1>Login</h1>

<form method="POST" use:enhance>
	<label for="handle">Handle</label>
	<input type="text" id="handle" name="handle" required value={form?.handle} />

	<label for="password">Password</label>
	<input type="password" id="password" name="password" required />

	<button type="submit">Login</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
