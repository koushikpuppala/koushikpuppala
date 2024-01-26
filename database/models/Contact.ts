import { model, models, Schema } from 'mongoose'

export default models.ContactMessage ||
	model(
		'ContactMessage',
		new Schema(
			{
				name: {
					type: String,
					required: true,
				},
				email: {
					type: String,
					required: true,
				},
				subject: {
					type: String,
					required: true,
				},
				message: {
					type: String,
					required: true,
				},
			},
			{
				timestamps: true,
			},
		),
	)
