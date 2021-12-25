import { v4 as uuidv4 } from 'uuid'

export const Portfolio = [
	{
		id: uuidv4(),
		project: 'koushikpuppala',
		title: 'Koushik Puppala',
		image: '/images/other/Koushikpuppala.webp',
		website: 'http://koushikpuppala.live',
		category: 'web',
		description: [
			'This is my First Project and Portfolio.',
			'Frontend was on Next JS.',
			'Backend was on Nodejs.',
			'Contact messages are linked to Discord.',
		],
	},
]
