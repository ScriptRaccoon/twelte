import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const post_id = event.params.post_id
	return { post_id }
}
