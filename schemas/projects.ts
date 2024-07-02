import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'project',
	title: 'Projects',
	type: 'document',
	fields: [
		defineField({
			name: 'title',
			title: 'Title',
			type: 'string',
			description: 'The title of the project',
			placeholder: 'Project Name',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'subtitle',
			title: 'Subtitle',
			type: 'string',
			description: 'The subtitle of the project',
			placeholder: 'Project Subtitle',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'tag',
			title: 'Tag',
			type: 'string',
			description: 'The tag of the project',
			placeholder: 'Project Tag',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'descriptions',
			title: 'Descriptions',
			type: 'array',
			description: 'The descriptions of the project',
			validation: Rule => Rule.required(),
			of: [{ type: 'text', rows: 2, validation: Rule => Rule.required() }],
		}),
		defineField({
			name: 'tags',
			title: 'Tags',
			type: 'array',
			description: 'The tags of the project',
			of: [{ type: 'string' }],
			options: {
				direction: 'horizontal',
				layout: 'tags',
			},
			validation: Rule => Rule.max(3).error('You can add up to 3 elements only.'),
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'array',
			description: 'The image of the project',
			of: [{ type: 'image', validation: Rule => Rule.required() }],
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'github',
			title: 'GitHub',
			type: 'url',
			description: 'The GitHub link of the project',
			placeholder: 'https://github.com/koushikpuppala/koushikpuppala',
			validation: Rule =>
				Rule.uri({
					scheme: ['http', 'https'],
				}),
		}),
		defineField({
			name: 'website',
			title: 'Website',
			type: 'url',
			description: 'The website link of the project',
			placeholder: 'https://koushikpuppala.com',
			validation: Rule =>
				Rule.uri({
					scheme: ['http', 'https'],
				}),
		}),
	],
})
