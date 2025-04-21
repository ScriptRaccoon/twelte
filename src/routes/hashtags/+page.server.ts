import { query } from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const period = event.url.searchParams.get('period') ?? 'day'

	const sql_alltime = `
	SELECT
		count(*) as count,
		hashtag as tag
	FROM
		post_hashtags
	GROUP BY
		hashtag
	ORDER BY
		count DESC;
	`

	const sql_day = `
	SELECT
		count(*) as count,
		hashtag as tag
	FROM
		post_hashtags
	WHERE
		created_at >= datetime('now', '-1 day')
	GROUP BY
		tag
	ORDER BY
		count DESC
	`

	const sql = period === 'day' ? sql_day : sql_alltime

	const { success, rows: hashtags } = await query<{ count: number; tag: string }>(sql)

	if (!success) error(500, 'Database error')

	return { hashtags, period }
}
