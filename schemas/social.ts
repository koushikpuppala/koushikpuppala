import { defineField, defineType } from 'sanity'

export default defineType({
	name: 'social',
	title: 'Social',
	type: 'object',
	fields: [
		defineField({
			name: 'platform',
			title: 'Platform',
			type: 'string',
			description: 'The social media platform',
			placeholder: 'GitHub',
			options: {
				list: [
					{ title: 'Instagram', value: 'instagram' },
					{ title: 'LinkedIn', value: 'linkedin' },
					{ title: 'Facebook', value: 'facebook' },
					{ title: 'Discord', value: 'discord' },
					{ title: 'YouTube', value: 'youtube' },
					{ title: 'Twitter', value: 'twitter' },
					{ title: 'GitHub', value: 'github' },
					{ title: 'Server', value: 'server' },
					{ title: 'Skype', value: 'skype' },
				],
			},
			validation: Rule => Rule.required(),
		}),
		defineField({
			name: 'url',
			title: 'URL',
			type: 'url',
			description: 'The URL of the social media',
			placeholder: 'https://github.com/koushikpuppala',
			validation: Rule => Rule.required(),
		}),
	],
})
