import connectMongo from '../../database'
import { ContactSchema } from '../../database/models'
import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

const Contact = async (req: NextApiRequest, res: NextApiResponse) => {
	await connectMongo()
	const { name, email, subject, message } = req.body
	const contact = new ContactSchema({
		name,
		email,
		subject,
		message,
	})

	const mailer = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})

	await mailer.sendMail({
		from: `Admin Contact From <me@koushikpuppala.com>`,
		replyTo: `${name} <${email}>`,
		to: 'message@koushikpuppala.com',
		subject: subject,
		html: message,
	})

	await contact.save()

	res.status(200).json({
		message: 'Message sent successfully to Koushikpuppala',
	})
}

export default Contact
