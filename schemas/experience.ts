import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'experience',
	title: 'Experiences',
	type: 'document',
	fields: [
		defineField({
			name: 'position',
			title: 'Position',
			type: 'string',
			description: 'The position in the company',
			placeholder: 'Software Engineer',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'company',
			title: 'Company',
			type: 'string',
			description: 'The name of the company',
			placeholder: 'Google Inc.',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'startDate',
			title: 'Start Date',
			type: 'date',
			description: 'The start date of the experience',
			placeholder: 'December 2020',
			validation: Rule => Rule.required(),
			options: { dateFormat: 'MMMM YYYY' },
		}),
		defineField({
			name: 'endDate',
			title: 'End Date',
			type: 'date',
			description: 'The end date of the experience',
			placeholder: 'December 2021',
			options: { dateFormat: 'MMMM YYYY' },
			validation: Rule =>
				Rule.custom((endDate, { document }) => {
					if (!document?.current && !endDate) {
						return 'Please provide an end date or mark the experience as current'
					}

					return true
				}),
			hidden: ({ document }) => document?.current as boolean,
		}),
		defineField({
			name: 'current',
			title: 'Currently Working?',
			type: 'boolean',
			description: 'Is this experience current?',
			initialValue: true,
			options: { layout: 'checkbox' },
		}),
		defineField({
			name: 'description',
			title: 'Description',
			type: 'array',
			of: [{ type: 'text', rows: 3, validation: Rule => Rule.required() }],
			description: 'The description of the experience',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			description: 'The logo of the company',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'website',
			title: 'Website',
			type: 'url',
			description: 'The website of the company',
			placeholder: 'https://google.com',
			validation: Rule =>
				Rule.required().uri({
					scheme: ['http', 'https'],
				}),
		}),
	],
})
