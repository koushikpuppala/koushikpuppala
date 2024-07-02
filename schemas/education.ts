import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'education',
	title: 'Education',
	type: 'object',
	fields: [
		defineField({
			name: 'degree',
			title: 'Degree',
			type: 'string',
			description: 'The degree of the education',
			placeholder: 'Bachelor of Technology in Computer Science and Engineering',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'university',
			title: 'University',
			type: 'string',
			description: 'The name of the university',
			placeholder: 'Massachusetts Institute of Technology',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'startDate',
			title: 'Start Date',
			type: 'date',
			description: 'The start date of the education',
			placeholder: 'August 2020',
			validation: Rule => Rule.required(),
			options: { dateFormat: 'MMMM YYYY' },
		}),
		defineField({
			name: 'endDate',
			title: 'End Date',
			type: 'date',
			description: 'The end date of the education',
			placeholder: 'August 2024',
			options: { dateFormat: 'MMMM YYYY' },
			validation: Rule =>
				Rule.custom((endDate, { parent }) => {
					if (!(parent as any)?.current && !endDate) {
						return 'Please provide an end date or mark the education as current'
					}

					return true
				}),
			hidden: ({ parent }) => parent?.current as boolean,
		}),
		defineField({
			name: 'expectedDate',
			title: 'Expected Date',
			type: 'date',
			description: 'The expected end date of the education',
			placeholder: 'June 2024',
			validation: Rule =>
				Rule.custom((expectedDate, { parent }) => {
					if ((parent as any)?.current && !expectedDate) {
						return 'Please remove the expected end date or mark the education as ongoing'
					}

					return true
				}),
			options: { dateFormat: 'MMMM YYYY' },
			hidden: ({ parent }) => !parent?.current as boolean,
		}),
		defineField({
			name: 'current',
			title: 'Currently Studying?',
			type: 'boolean',
			description: 'Is the education currently ongoing?',
			initialValue: false,
			options: { layout: 'checkbox' },
		}),
		defineField({
			name: 'image',
			title: 'Image',
			type: 'image',
			description: 'The logo of the university',
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'website',
			title: 'Website',
			type: 'url',
			description: 'The website of the university',
			placeholder: 'https://www.mit.edu/',
			validation: Rule =>
				Rule.required().uri({
					scheme: ['http', 'https'],
				}),
		}),
	],
})
