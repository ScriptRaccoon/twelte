import type { ZodError } from 'zod'
import { formatDistanceToNow, format } from 'date-fns'

export function get_error_msg(err: ZodError) {
	return err.errors[0].message
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}

export function format_date(date: string): string {
	const then = new Date(`${date}Z`) // Add Z to make it UTC
	const now = new Date()

	if (now.getTime() - then.getTime() < 24 * 60 * 60 * 1000) {
		return formatDistanceToNow(then, { addSuffix: true })
	}

	return format(then, 'dd.MM.yyyy')
}
