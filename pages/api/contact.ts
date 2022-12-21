import { NextApiRequest, NextApiResponse } from 'next'
import { createTransport } from 'nodemailer'

const Contact = async (req: NextApiRequest, res: NextApiResponse) => {
	switch (req.method) {
		case 'POST': {
			const { name, email, subject, message } = req.body
			const mailer = createTransport({
				service: 'gmail',
				auth: {
					user: process.env.USER!,
					pass: process.env.PASS!,
				},
			})
			try {
				await mailer.sendMail({
					from: `Admin Contact From <me@koushikpuppala.com>`,
					replyTo: `${name} <${email}>`,
					to: 'message@koushikpuppala.com',
					subject: `${name} (${email}) sent you a message`,
					html: `<b>Subject:</b> ${subject}<br /><br /><b>Message:</b> ${message}`,
				})
				return res.status(200).json({ message: 'Message sent successfully.' })
			} catch (error) {
				return res.status(500).json({
					message: 'Error in sending the message. Please Try again Later.',
				})
			}
		}
	}
}

export default Contact
