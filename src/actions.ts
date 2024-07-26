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
			subject: `${subject.toLocaleLowerCase().includes('urgent') ? 'URGENT: ' : ''} New Message from ${name}`,
			html: `
				<h4>Hi Koushik,</h4>
				<p>You have received a new message from <strong>${name}</strong> with the following details:</p>
				<p><strong>Name:</strong> ${name}</p>
				<p><strong>Email:</strong> ${email}</p>
				<p><strong>Subject:</strong> ${subject}</p>
				<p><strong>Message:</strong> ${message}</p>
				<p style="font-family: Georgia, serif;">
					<strong><em>------</em></strong><br>
					<strong><em>Best Regards,</em></strong><br>
					<strong><em>Koushik Puppala</em></strong><br>
					<strong><em>Freelancer and Developer</em></strong><br>
					<strong><em>Website:</em></strong> <a href="https://koushikpuppala.com" style="color: rgb(230, 145, 56); text-decoration: none;"><strong><em>koushikpuppala.com</em></strong></a><br>
					<strong><em>------</em></strong>
				</p>
				<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
				<p>Note: This is an automated message. Please do not reply to this email.</p>
			`,
		})

		await mailer.sendMail({
			from: `Koushikpuppala <no-reply@koushikpuppala.com>`,
			sender: 'no-reply@koushikpuppala.com',
			to: email,
			subject: 'Thank you for reaching out!',
			html: `
				<p>Dear ${name},</p>
				<p>Thank you for getting in touch!</p>
				<p>I have received your message regarding <strong>${subject}</strong> and will get back to you as soon as possible. Your input and inquiries are important to me, and I strive to respond promptly.</p>
				<p>If your message requires immediate attention, please mention "Urgent" in the subject line next time, and I will prioritize it accordingly.</p>
				<p>Thank you for your patience.</p>
				<p style="font-family: Georgia, serif;">
					<strong><em>------</em></strong><br>
					<strong><em>Best Regards,</em></strong><br>
					<strong><em>Koushik Puppala</em></strong><br>
					<strong><em>Freelancer and Developer</em></strong><br>
					<strong><em>Website:</em></strong> <a href="https://koushikpuppala.com" style="color: rgb(230, 145, 56); text-decoration: none;"><strong><em>koushikpuppala.com</em></strong></a><br>
					<strong><em>------</em></strong>
				</p>
				<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
				<p>Note: This is an automated response. Please do not reply to this email.</p>
			`,
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
