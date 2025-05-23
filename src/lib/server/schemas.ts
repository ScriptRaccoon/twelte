import { z } from 'zod'

import { MAX_BIO_LENGTH, MAX_POST_LENGTH } from '$lib/config'

export const email_schema = z
	.string({
		required_error: 'Email is required',
		invalid_type_error: 'Email must be a string'
	})
	.email({ message: 'Invalid email address' })
	.max(320, {
		message: 'Email must be at most 320 characters long'
	})

export const password_schema = z
	.string({
		required_error: 'Password is required',
		invalid_type_error: 'Password must be a string'
	})
	.min(8, {
		message: 'Password must be at least 8 characters long'
	})
	.max(100, {
		message: 'Password must be at most 100 characters long'
	})
	.regex(/\d/, {
		message: 'Password must contain at least one number'
	})
	.regex(/[a-zA-Z]/, {
		message: 'Password must contain at least one letter'
	})

export const handle_schema = z
	.string({
		required_error: 'Handle is required',
		invalid_type_error: 'Handle must be a string'
	})
	.min(1, {
		message: 'Handle cannot be empty'
	})
	.max(30, {
		message: 'Handle must be at most 30 characters long'
	})
	.regex(/^[a-z0-9-_]+$/, {
		message: 'Handle must only contain lowercase letters, numbers, dashes and underscores'
	})

export const bio_schema = z
	.string({
		invalid_type_error: 'Bio must be a string',
		required_error: 'Bio is required'
	})
	.max(MAX_BIO_LENGTH, {
		message: `Bio must be at most ${MAX_BIO_LENGTH} characters long`
	})
	.transform((value) => value.trim())

export const name_schema = z
	.string({
		invalid_type_error: 'Name must be a string',
		required_error: 'Name is required'
	})
	.min(1, {
		message: 'Name must be at least 1 character long'
	})
	.max(50, {
		message: 'Name must be at most 50 characters long'
	})
	.regex(/^[a-zA-Z0-9 _.-]*$/, {
		message:
			'Display name can only contain letters, numbers, spaces, underscores, dashes, and periods'
	})
	.refine((val) => !val.startsWith(' '), {
		message: 'Name cannot start with a space'
	})
	.refine((val) => !val.endsWith(' '), {
		message: 'Name cannot end with a space'
	})
	.refine((val) => !val.includes('  '), {
		message: 'Name cannot contain consecutive spaces'
	})

export const website_schema = z
	.string({ invalid_type_error: 'Website must be a string' })
	.url({ message: 'Invalid URL' })
	.max(200, { message: 'Website must be at most 200 characters long' })
	.nullable()

const post_content_schema = z
	.string({
		required_error: 'Post content is required',
		invalid_type_error: 'Post content must be a string'
	})
	.max(MAX_POST_LENGTH, {
		message: `Post must be at most ${MAX_POST_LENGTH} characters long`
	})
	.transform((value) => value.trim())

export const post_request_schema = z.object({
	content: post_content_schema,
	parent_id: z.number({ invalid_type_error: 'Parent ID must be a number' }).optional()
})
