import { SANITY_DOCUMENT_TYPE } from '@import/constant'
import { defineField, defineType } from 'sanity'

export default defineType({
	name: SANITY_DOCUMENT_TYPE.ABOUT,
	title: 'About',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			description: 'The title of the about page',
			initialValue: 'About Me',
			readOnly: true,
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'introduction',
			title: 'Introduction',
			type: 'text',
			description: 'A short introduction about yourself',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'resume',
			title: 'Resume',
			type: 'file',
			description: 'Your resume',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'services',
			title: 'Services',
			type: 'array',
			description: 'The services you provide',
			of: [{ type: 'service' }],
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'educations',
			title: 'Educations',
			type: 'array',
			description: 'The educations you have',
			of: [{ type: 'education' }],
			validation: Rule => Rule.required(),
		}),
	],
})
