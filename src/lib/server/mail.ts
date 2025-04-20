import { EMAIL_ADDRESS, EMAIL_PASSWORD, SIMULATE_EMAILS } from '$env/static/private'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: EMAIL_ADDRESS,
		pass: EMAIL_PASSWORD
	}
})

type MailOptions = {
	to: string
	subject: string
	text: string
}

async function send_mail(options: MailOptions): Promise<{ success: boolean }> {
	if (SIMULATE_EMAILS === 'true') {
		console.debug('Email sent (simulated):', options)
		return { success: true }
	}

	try {
		const info = await transporter.sendMail(options)
		console.debug('Email sent:', info.response)
		return { success: true }
	} catch (error) {
		console.error('Error sending email:', error)
		return { success: false }
	}
}

export async function send_verification_email(
	origin: string,
	email: string,
	token: string
): Promise<{ success: boolean }> {
	const verification_url = `${origin}/email_verification?token=${token}`

	const text =
		'Visit the following link to verify your email address:\n\n' +
		verification_url +
		`\n\n` +
		'This link will expire in 1 hour.\n\n' +
		'If you did not request this email, please ignore it.\n\n' +
		'Thank you for using Twelte!'

	const options = {
		to: email,
		subject: 'Twelte - Email Verification',
		text
	}

	return send_mail(options)
}
