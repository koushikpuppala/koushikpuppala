'use server'

import { createTransport } from 'nodemailer'
import { captureException } from '@sentry/nextjs'
import { handleFormSubmitType } from '@import/types'
import { ContactModel, DatabaseInstance } from '@import/database'
import { notificationTemplate, autoReplyTemplate } from './constant'

export const handleSubmit: handleFormSubmitType = async (prevState, form) => {
	if (prevState.statusCode === 200) return prevState

	const database = DatabaseInstance

	const name = form.get('name')!.toString()
	const email = form.get('email')!.toString()
	const subject = form.get('subject')!.toString()
	const message = form.get('message')!.toString()

	const mailer = createTransport({
		host: process.env.HOST,
		port: 587,
		secure: false,
		auth: { user: process.env.USER, pass: process.env.PASS },
		tls: { ciphers: 'SSLv3', rejectUnauthorized: false },
	})

	try {
		await database.connect()

		await ContactModel.create({ name, email, subject, message })

		await mailer.sendMail({
			from: `Koushikpuppala <no-reply@koushikpuppala.com>`,
			sender: email,
			to: 'form@koushikpuppala.com',
			subject: `New Message Received from ${name} - ${subject.toLocaleLowerCase().includes('urgent') ? 'URGENT: ' : ''}${subject}`,
			html: notificationTemplate({ name, email, subject, message }),
		})

		await mailer.sendMail({
			from: `Koushikpuppala <no-reply@koushikpuppala.com>`,
			sender: 'no-reply@koushikpuppala.com',
			to: email,
			subject: `Thank You for Your Message, ${name}!`,
			html: autoReplyTemplate({ name, subject }),
		})

		return {
			statusCode: 200,
			statusMessage: 'Submitted successfully, I will get back to you as soon as possible!',
		}
	} catch (error) {
		// process.env.NODE_ENV === 'development' && console.log(error)
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
		{ method: 'POST', cache: 'no-cache' },
	)

	const data = await response.json()

	if (!data.success) {
		captureException(new Error('Failed to verify reCaptcha'))
		return false
	}

	return true
}
