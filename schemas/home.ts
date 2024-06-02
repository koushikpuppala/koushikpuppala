import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'home',
	title: 'Home',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			description: 'The title of the home',
			placeholder: 'Koushik Puppala',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'separator',
			title: 'Separator',
			type: 'string',
			description: 'The separator of the title',
			placeholder: '|',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'subtitles',
			title: 'Subtitles',
			type: 'array',
			description: 'The subtitles of the home',
			validation: Rule => Rule.required(),
			of: [{ type: 'string' }],
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'object',
			description: 'The description of the home',
			validation: Rule => Rule.required(),
			fields: [
				defineField({
					name: 'content',
					title: 'Content',
					type: 'string',
					description: 'The content of the description',
				}),
				defineField({
					name: 'extend',
					title: 'Extend',
					type: 'array',
					description: 'The extend of the description',
					of: [{ type: 'string' }],
				}),
			],
		}),
		defineField({
			name: 'social',
			title: 'Social',
			type: 'array',
			of: [{ type: 'social' }],
		}),
	],
})
