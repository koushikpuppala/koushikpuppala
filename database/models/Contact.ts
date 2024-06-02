import { ContactModalProps } from '@import/types'
import { Model, model, models, Schema } from 'mongoose'

export default (models.Contact as Model<ContactModalProps>) ||
	model(
		'Contact',
		new Schema<ContactModalProps>(
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
