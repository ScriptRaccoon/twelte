<script lang="ts">
	import { enhance } from '$app/forms'

	let { form } = $props()
</script>

<h2>Login</h2>

<form method="POST" use:enhance class="form">
	<div class="input-group">
		<label for="handle">Handle</label>
		<input type="text" id="handle" name="handle" required value={form?.handle} />
	</div>

	<div class="input-group">
		<label for="password">Password</label>
		<input type="password" id="password" name="password" required />
	</div>

	<button class="button" type="submit">Login</button>
</form>

{#if form?.error}
	<p class="error">{form.error}</p>
{/if}
