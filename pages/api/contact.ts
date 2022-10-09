import { NextApiRequest, NextApiResponse } from 'next'
import { ContactSchema } from '@import/database/models'
import { Database } from '@import/database'
import { createTransport } from 'nodemailer'
import { config } from '@import/config'

const Contact = async (req: NextApiRequest, res: NextApiResponse) => {
	Database.connect()

	switch (req.method) {
		case 'POST': {
			const { name, email, subject, message } = req.body
			const contact = new ContactSchema({ name, email, subject, message })
			const mailer = createTransport(config.transport)

			try {
				await contact.save()
				await mailer.sendMail({
					from: `Admin Contact From <me@koushikpuppala.com>`,
					replyTo: `${name} <${email}>`,
					to: 'message@koushikpuppala.com',
					subject: `${name} (${email}) sent you a message`,
					html: `<b>Subject:</b> ${subject}<br /><br /><b>Message:</b> ${message}`,
				})
				res.status(200).json({ message: 'Message sent successfully.' })
			} catch (error) {
				res.status(500).json({
					message: 'Error in sending the message. Please Try again Later.',
				})
			}
		}
	}
}

export default Contact
