import { model, models, Schema } from 'mongoose'

export default models.Contact ||
	model(
		'Contact',
		new Schema({
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
	)
