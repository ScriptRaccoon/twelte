<script lang="ts">
	import type { UserLocals } from '$lib/types'
	import {
		faHashtag,
		faHome,
		faInbox,
		faPencil,
		faRightToBracket,
		faSliders,
		faUserAlt
	} from '@fortawesome/free-solid-svg-icons'
	import IconLink from './IconLink.svelte'

	type Props = {
		user: UserLocals | undefined
	}
	let { user }: Props = $props()
</script>

<header>
	<nav>
		<ul>
			<li>
				<IconLink href="/" icon={faHome} label="Feed" />
			</li>
			<li>
				<IconLink href="/hashtags" icon={faHashtag} label="Tags" />
			</li>
			{#if user}
				<li>
					<IconLink href={`/profile/${user.handle}`} icon={faUserAlt} label="Profile" />
				</li>
				<li>
					<IconLink href="/account/dashboard" icon={faSliders} label="Account" />
				</li>
				<li>
					<IconLink href="/account/inbox" icon={faInbox} label="Inbox" />
				</li>
				<li>
					<IconLink href="/post/create" icon={faPencil} label="Post" />
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
		padding-block: 1rem;
		position: relative;
	}

	h1 {
		font-size: 1.5rem;
		text-transform: uppercase;
		color: var(--primary-color);
		position: absolute;
		top: 1rem;
		left: calc(100% + 1rem);
	}

	ul {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 0.75rem;
	}

	@media (max-width: 900px) {
		header {
			display: grid;
			grid-template-columns: 1fr auto;
			gap: 0.5rem;
		}

		header :global(.link-label) {
			display: none;
		}

		ul {
			gap: 0.5rem;
		}

		h1 {
			font-size: 1.125rem;
			position: initial;
			top: unset;
			left: unset;
		}
	}
</style>
