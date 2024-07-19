'use server'

import { ContactModel, DatabaseInstance } from '@import/database'
import { handleFormSubmitType } from '@import/types'
import { captureException } from '@sentry/nextjs'
import { createTransport } from 'nodemailer'

export const handleSubmit: handleFormSubmitType = async (prevState, form) => {
	if (prevState.statusCode === 200) return prevState

	const database = DatabaseInstance

	const name = form.get('name')!.toString()
	const email = form.get('email')!.toString()
	const subject = form.get('subject')!.toString()
	const message = form.get('message')!.toString()

	const mailer = createTransport({
		service: 'gmail',
		auth: { user: process.env.USER!, pass: process.env.PASS! },
	})

	try {
		await database.connect()

		await ContactModel.create({
			name,
			email,
			subject,
			message,
		})

		await mailer.sendMail({
			from: `Admin Contact Form <me@koushikpuppala.com>`,
			replyTo: email,
			sender: email,
			to: 'message@koushikpuppala.com',
			subject: `${name} (${email}) sent you a message`,
			html: `<b>Subject:</b> ${subject}<br /><br /><b>Message:</b> ${message}`,
		})

		return {
			statusCode: 200,
			statusMessage: 'Submitted successfully, I will get back to you as soon as possible!',
		}
	} catch (error) {
		process.env.NODE_ENV === 'development' && console.log(error)
		captureException(error)
		return {
			statusCode: 500,
			statusMessage: 'Something went wrong, please try again later.',
		}
	} finally {
		await database.disconnect()
		mailer.close()
	}
}

export const handleReCaptcha = async (token: string) => {
	const response = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
		{
			method: 'POST',
			cache: 'no-cache',
		},
	)

	const data = await response.json()

	return data.success
}
