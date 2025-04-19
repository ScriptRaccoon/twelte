import { z } from 'zod'

export const email_schema = z
	.string({
		required_error: 'Email is required',
		invalid_type_error: 'Email must be a string'
	})
	.email({ message: 'Invalid email address' })

export const password_schema = z
	.string({
		required_error: 'Password is required',
		invalid_type_error: 'Password must be a string'
	})
	.min(6, {
		message: 'Password must be at least 6 characters long'
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
		message: 'Handle must be at least 1 character long'
	})
	.max(50, {
		message: 'Handle must be at most 50 characters long'
	})
	.regex(/^[a-z0-9-_]+$/, {
		message: 'Handle must only contain lowercase letters, numbers, dashes and underscores'
	})

export const bio_schema = z
	.string({
		invalid_type_error: 'Bio must be a string',
		required_error: 'Bio is required'
	})
	.max(160, {
		message: 'Bio must be at most 160 characters long'
	})

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

export const post_content_schema = z
	.string({
		required_error: 'Post content is required',
		invalid_type_error: 'Post content must be a string'
	})
	.max(280, {
		message: 'Post must be at most 280 characters long'
	})
