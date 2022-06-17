import connectMongo from '../../database'
import { ContactSchema } from '../../database/models'
import { NextApiRequest, NextApiResponse } from 'next'

const Contact = async (req: NextApiRequest, res: NextApiResponse) => {
	await connectMongo()
	const { name, email, subject, message } = req.body
	const contact = new ContactSchema({
		name,
		email,
		subject,
		message,
	})
	await contact.save()
	res.status(200).json({
		message: 'Message sent successfully to Koushikpuppala',
	})
}

export default Contact
