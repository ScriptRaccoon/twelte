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

export function cut_text(text: string, length: number): string {
	if (text.length <= length) return text
	return `${text.slice(0, length)}...`
}

export function extract_hashtags(content: string): string[] {
	const matches = content.matchAll(/#(\w+)/g)
	return Array.from(matches).map((match) => match[1])
}
const url_regex = /(https?:\/\/[^\s]+)/
const hashtag_regex = /#(\w+)/

type Token = { text: string; type: 'url' | 'hashtag' | 'text' }

export function tokenize_content(content: string): Token[] {
	const tokens: Token[] = []
	let idx = 0

	const combined_regex = new RegExp(`${url_regex.source}|${hashtag_regex.source}`, 'g')
	let match

	while ((match = combined_regex.exec(content)) !== null) {
		if (match.index > idx) {
			tokens.push({
				text: content.slice(idx, match.index),
				type: 'text'
			})
		}

		if (match[0].match(url_regex)) {
			tokens.push({ text: match[0], type: 'url' })
		} else if (match[0].match(hashtag_regex)) {
			tokens.push({ text: match[0], type: 'hashtag' })
		}

		idx = combined_regex.lastIndex
	}

	if (idx < content.length) {
		tokens.push({ text: content.slice(idx), type: 'text' })
	}

	return tokens
}
