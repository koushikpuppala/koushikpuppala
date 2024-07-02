import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'service',
	title: 'Services',
	type: 'object',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			description: 'The title of the service',
			placeholder: 'Full Stack Development',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'string',
			description: 'The description of the service',
			placeholder: 'I can develop web applications with the latest technologies',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			description: 'The image of the service',
			validation: Rule => Rule.required(),
		}),
	],
})
