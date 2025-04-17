<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<h1>Login</h1>

<form method="POST" action="?/login" use:enhance>
	<label for="handle">Handle</label>
	<input type="text" id="handle" name="handle" required />

	<label for="password">Password</label>
	<input type="password" id="password" name="password" required />

	<button type="submit">Login</button>
</form>
