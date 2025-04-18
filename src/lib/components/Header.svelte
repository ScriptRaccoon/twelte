<script lang="ts">
	import type { UserLocals } from '$lib/types'
	import {
		faHome,
		faRightToBracket,
		faSliders,
		faUserAlt
	} from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import IconLink from './IconLink.svelte'
	import { page } from '$app/state'

	type Props = {
		user: UserLocals | undefined
	}
	let { user }: Props = $props()
</script>

<header>
	<nav>
		<ul>
			<li>
				<IconLink href="/" icon={faHome} label="Home" />
			</li>
			{#if user}
				<li>
					<IconLink href={`/profile/${user.handle}`} icon={faUserAlt} label="Profile" />
				</li>
				<li>
					<IconLink href="/account/dashboard" icon={faSliders} label="Account" />
				</li>
			{:else}
				<li>
					<IconLink href="/account/create" icon={faUserAlt} label="Create Account" />
				</li>
				<li>
					<IconLink href="/account/login" icon={faRightToBracket} label="Login" />
				</li>
			{/if}
		</ul>
	</nav>

	<h1>Twelte</h1>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-block: 1rem;
		gap: 0.25rem;
	}

	ul {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	h1 {
		font-weight: 600;
		font-size: inherit;
		text-transform: uppercase;
		color: var(--primary-color);
	}

	@media (max-width: 420px) {
		ul {
			font-size: 0.825rem;
			gap: 0.5rem;
		}
	}
</style>
