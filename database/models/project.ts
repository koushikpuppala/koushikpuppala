import { model, models, Schema } from 'mongoose'

export default models.Project ||
	model(
		'Project',
		new Schema({
			title: {
				type: String,
			},
			subtitle: {
				type: String,
			},
			description: {
				type: String,
			},
			url: {
				type: String,
			},
			source: {
				type: String,
			},
			filter: {
				type: String,
			},
			date: {
				start: {
					type: Date,
				},
				end: {
					type: String,
				},
			},
			image: {
				desktop: {
					type: String,
				},
				mobile: {
					type: String,
				},
				web: {
					type: String,
				},
			},
		})
	)
