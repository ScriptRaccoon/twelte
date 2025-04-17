// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	type User = {
		id: number;
		handle: string;
	};

	namespace App {
		// interface Error {}
		interface Locals {
			user?: User;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
