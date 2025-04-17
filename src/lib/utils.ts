import type { ZodError } from 'zod'

export function get_error_msg(err: ZodError) {
	return err.errors[0].message
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms))
}
