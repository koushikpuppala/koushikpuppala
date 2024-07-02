'use server'

import { ContactModel, Database } from '@import/database'
import { captureException } from '@sentry/nextjs'
import { createTransport } from 'nodemailer'

export const handleSubmit = async (
	prevState: {
		statusCode: number
		statusMessage: string
	},
	form: FormData,
) => {
	'use server'

	const database = Database.instance

	const name = form.get('name')!.toString()
	const email = form.get('email')!.toString()
	const subject = form.get('subject')!.toString()
	const message = form.get('message')!.toString()

	const mailer = createTransport({
		service: 'gmail',
		auth: {
			user: process.env.USERNAME!,
			pass: process.env.PASSWORD!,
		},
	})

	if (prevState.statusCode === 200 || prevState.statusCode === 400) {
		return {
			statusCode: 400,
			statusMessage: 'You have already submitted a message. Please wait for a response. Thank you!',
		}
	}

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
