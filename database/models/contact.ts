import { Schema, model, models } from 'mongoose'

const contactSchema = new Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
	},
	subject: {
		type: String,
	},
	message: {
		type: String,
	},
})

const Contact = models.Contact || model('Contact', contactSchema)

export default Contact
