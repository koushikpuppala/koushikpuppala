import { v4 as uuidv4 } from 'uuid'

export const PortfolioData = [
	{
		id: uuidv4(),
		project: 'koushikpuppala',
		title: 'Koushik Puppala',
		image: '/images/other/Koushikpuppala.webp',
		website: 'https://koushikpuppala.live',
		category: 'web',
		aos: 1,
		description: [
			'This is my First Project and Portfolio.',
			'Frontend was on Next JS.',
			'Backend was on Nodejs.',
			'Contact messages are linked to Discord.',
		],
	},
	{
		id: uuidv4(),
		project: 'avengers-assemble',
		title: 'Avengers Assemble',
		image: '/images/other/AvengersAssemble.webp',
		website: 'https://avengers-assemble.tech',
		category: 'web',
		aos: 2,
		description: [
			'This is website for Avengers Assemble Server. You can see my Two bots in this.',
			'Frontend was on EJS (Embedded JavaScript).',
			'Backend was on Nodejs',
			'Database was on MongoDB.',
		],
	},
	{
		id: uuidv4(),
		project: 'iiitraichur',
		title: 'IIIT Raichur',
		image: '/images/other/IIITR.webp',
		website: 'https://iiitr.ac.in',
		category: 'web',
		aos: 3,
		description: [''],
	},
	{
		id: uuidv4(),
		project: 'avenger',
		title: 'Avenger Discord Bot',
		image: '/Untitled-design.png',
		website: 'https://discordlists100.xyz',
		category: 'web',
		aos: 4,
		description: [''],
	},
]
