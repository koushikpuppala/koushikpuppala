import * as images from '@import/images'
import { EducationDataProps, ExperienceDataProps, ProjectDataProps } from '@import/interface'
import { FaLinkedinIn, FaGithub, FaDiscord, FaSkype } from 'react-icons/fa6'
import { HiHome, HiUser, HiDocument, HiEnvelopeOpen, HiBriefcase, HiFolder } from 'react-icons/hi2'

export const SocialMedia = [
	{ name: 'Linkedin', href: '/linkedin', icon: FaLinkedinIn },
	{ name: 'GitHub', href: '/github', icon: FaGithub },
	{ name: 'Discord', href: '/discord', icon: FaDiscord },
	{ name: 'Skype', href: '/skype', icon: FaSkype },
]

export const NavbarData = [
	{ name: 'Home', href: '/', icon: HiHome },
	{ name: 'About', href: '/about', icon: HiUser },
	{ name: 'Experience', href: '/experience', icon: HiBriefcase },
	{ name: 'Portfolio', href: '/portfolio', icon: HiFolder },
	{ name: 'Resume', href: '/resume', icon: HiDocument },
	{ name: 'Contact', href: '/contact', icon: HiEnvelopeOpen },
	{ name: 'Contact', href: '/contact', icon: HiEnvelopeOpen },
]

export const ServicesData = [
	{ title: 'Full Stack Developer', icon: images.FullStackImage },
	{ title: 'Open Source Contributor', icon: images.OpenSourceImage },
	{ title: 'Frontend Developer', icon: images.FrontendImage },
	{ title: 'Backend Developer', icon: images.BackendImage },
]

export const EducationData: EducationDataProps[] = [
	{
		degree: 'Computer Science Engineer (B.Tech)',
		college: 'Indian Institute of Information Technology, Raichur',
		startDate: 'December 2020',
		endDate: 'Present (Until May 2024)',
		image: images.IIITRLogo,
		imageBackground: '#E6DEDD',
		website: 'https://iiitr.ac.in/',
	},
	{
		degree: 'M.P.C Intermediate',
		college: 'Tirumala IIT & Medical Academy',
		startDate: 'June 2018',
		endDate: 'March 2020',
		image: images.CollegeLogo,
		imageBackground: '#E6DEDD',
		website: 'https://tirumalaedu.com/',
	},
	{
		degree: 'S.S.C',
		college: 'Tirumala Proactive (EM) High School',
		startDate: 'June 2017',
		endDate: 'March 2018',
		image: images.SchoolLogo,
		imageBackground: '#E6DEDD',
		website: 'https://tirumalaedu.com/',
	},
]

export const ExperienceData: ExperienceDataProps[] = [
	{
		role: 'Full Stack Web Developer (Team Lead & Mentor)',
		company: 'Indian Institute of Information Technology, Raichur',
		startDate: 'August 2022',
		endDate: 'Present',
		descriptions: [
			'Led a team of developers in the achievement of project goals. Fostered collaboration, oversaw allocating responsibilities, and provided guidance and support to team members, resulting in increased productivity and a cohesive work environment.',
			'Collaborated with faculty, staff, and student organizations to gather requirements and ensure the website met their needs.',
		],
		image: images.IIITRLogo,
		imageBackground: '#E6DEDD',
		website: 'http://iiitr.ac.in/',
	},
	{
		role: 'Frontend Developer Internship',
		company: 'MapleMonk',
		startDate: 'June 2023',
		endDate: 'July 2023',
		descriptions: [
			'Used Angular for the front end and React for Apache Superset, an open-source project.',
			'Added features to the front end, such as a support system for both the client and admin versions and theme customization for the dashboard.',
			'Added features to Superset, such as a custom date picker and theme customization at the dashboard and chart level.',
		],
		image: images.MaplemonkLogo,
		imageBackground: '#383E56',
		website: 'https://www.maplemonk.com/',
	},
	{
		role: 'Full Stack Developer Internship',
		company: 'TGH Technologies',
		startDate: 'August 2022',
		endDate: 'September 2022',
		descriptions: [
			'A leave management system with React, Figma, Node.js, MongoDB, and Firebase. Features include approval of leave requests by admins and managers and push notifications.',
		],
		image: images.TGHLogo,
		imageBackground: '#E6DEDD',
		website: 'https://www.tghtech.com/',
	},
	{
		role: 'Google Developer Student Clubs Lead',
		company: 'Google Developer Student Clubs',
		startDate: 'July 2022',
		endDate: 'June 2023',
		descriptions: [
			'Led and managed the GDSC Club, a technology community focused on innovation and collaboration.',
			'Coordinated and supervised club activities to ensure successful execution and impactful outcomes.',
			"Collaborated with other student clubs and organizations to expand the club's reach and promote interdisciplinary collaboration.",
		],
		image: images.GDSCLogo,
		imageBackground: '#383E56',
		website: 'https://developers.google.com/community/gdsc',
	},
	{
		role: 'CodeSoc Club Coordinator',
		company: 'Indian Institute of Information Technology, Raichur',
		startDate: 'September 2021',
		endDate: 'August 2022',
		descriptions: [
			'Coordinated and managed the activities of the Codesoc Club, a vibrant community dedicated to promoting coding culture.',
			"Organized regular coding workshops and coding competitions, providing valuable learning opportunities for club members. In addition, I managed the club's budget, allocating resources effectively to support club initiatives and events.",
		],
		image: images.IIITRLogo,
		imageBackground: '#E6DEDD',
		website: 'https://iiitr.ac.in/',
	},
	{
		role: 'Frontend Lead (GDSC Core Team)',
		company: 'Google Developer Student Clubs IIIT Raichur',
		startDate: 'September 2021',
		endDate: 'May 2022',
		descriptions: [
			'Led the front-end development initiatives of the GDSC Club, overseeing a team and driving the successful execution of various projects.',
			'Stayed updated with the latest trends and advancements in front-end development, sharing knowledge with the team, and organizing workshops or training sessions.',
			'Served as a facilitator for the Android app development study jam by GDSC India.',
		],
		image: images.GDSCLogo,
		imageBackground: '#383E56',
		website: 'https://gdsc.community.dev/indian-institute-of-information-technology-raichur/',
	},
	{
		role: 'Full Stack Web Developer (Task Master)',
		company: 'Indian Institute of Information Technology, Raichur',
		startDate: 'December 2020',
		endDate: 'August 2022',
		descriptions: [
			'Collaborated closely with a dedicated team to develop and maintain the website, contributing to its success and functionality.',
			'Provided valuable insights and ideas for improving website design, functionality, and user engagement.',
			'Quickly learned new technologies and tools, expanded my skill set, and contributed to the team.',
		],
		image: images.IIITRLogo,
		imageBackground: '#E6DEDD',
		website: 'https://iiitr.ac.in/',
	},
]

export const ProjectTagsData = [
	'All',
	'Web Development',
	'Discord Bot',
	'Windows App',
	'Neural Network',
	'Open Source Project',
]

export const ProjectsData: ProjectDataProps[] = [
	{
		title: 'Portfolio',
		subtitle: 'Personal Website | First Project',
		tag: 'Web Development',
		descriptions: [
			'This was my first web development project. It started with basic HTML and progressed to advanced Nextjs code with Typescript. The project is open-source and available on GitHub.',
		],
		tags: [
			{
				name: 'nextjs',
				color: 'blue-text-gradient',
			},
			{
				name: 'typescript',
				color: 'green-text-gradient',
			},
			{
				name: 'tailwind',
				color: 'pink-text-gradient',
			},
		],
		image: images.KoushikpuppalaProjectImage,
		github: 'koushikpuppala',
		website: 'https://koushikpuppala.com/',
	},
	{
		title: 'Musics_DJ',
		subtitle: 'Discord Bot | Music Player',
		tag: 'Discord Bot',
		descriptions: [
			'This is an open-source Discord bot using JavaScript and Discord JS. It has numerous music controls, including volume, play, pauses, and skip.',
		],
		tags: [
			{
				name: 'javascript',
				color: 'blue-text-gradient',
			},
			{
				name: 'express',
				color: 'green-text-gradient',
			},
			{
				name: 'discordjs',
				color: 'pink-text-gradient',
			},
		],
		image: images.MusicsDJProjectImage,
		github: 'musics_dj',
	},
	{
		title: 'E.D.I.T.H Screen Recorder',
		subtitle: 'Windows App | Electron',
		tag: 'Windows App',
		descriptions: [
			"Screen recording app built with JavaScript, HTML, and Electron. It can authenticate with Google Drive and automatically post the recorded video to the user's Google Drive.",
		],
		tags: [
			{
				name: 'electron',
				color: 'blue-text-gradient',
			},
			{
				name: 'HTML',
				color: 'green-text-gradient',
			},
			{
				name: 'google-drive',
				color: 'pink-text-gradient',
			},
		],
		image: images.EdithProjectImage,
		github: 'E.D.I.T.H-Screen-Recorder',
	},
	{
		title: 'Avenger Bot',
		subtitle: 'Discord Bot | Multi-purpose',
		tag: 'Discord Bot',
		descriptions: [
			'Open-source Discord bot with 250 commands, 40 customizable options, extensive logging, advanced auto-moderation, custom playlist support, giveaways, reaction roles, and more.',
		],
		tags: [
			{
				name: 'javascript',
				color: 'blue-text-gradient',
			},
			{
				name: 'express',
				color: 'green-text-gradient',
			},
			{
				name: 'discordjs',
				color: 'pink-text-gradient',
			},
		],
		image: images.AvengerProjectImage,
		github: 'avenger',
	},
	{
		title: 'Avengers Assemble',
		subtitle: 'Discord Bots website | Dashboard',
		tag: 'Web Development',
		descriptions: [
			'The Discord bot website is built with EJS, Node.js, Express, and MongoDB. The dashboard allows for easy parameter changes. More than 250 commands are accessible with Discord Login.',
		],
		tags: [
			{
				name: 'EJS',
				color: 'blue-text-gradient',
			},
			{
				name: 'mongodb',
				color: 'green-text-gradient',
			},
			{
				name: 'express',
				color: 'pink-text-gradient',
			},
		],
		image: images.AvengersAssembleProjectImage,
		github: 'avenger',
	},
	{
		title: 'Official Website',
		subtitle: 'Indian Institute of Information Technology, Raichur',
		tag: 'Web Development',
		descriptions: [
			'This website contains all the information about admission, careers, faculty, research, facilities, etc.',
		],
		tags: [
			{
				name: 'jekyll',
				color: 'blue-text-gradient',
			},
			{
				name: 'github',
				color: 'green-text-gradient',
			},
			{
				name: 'vercel',
				color: 'pink-text-gradient',
			},
		],
		image: images.IIITRaichurProjectImage,
		website: 'https://iiitr.ac.in',
	},
	{
		title: 'Council of Students Affairs Official Website',
		subtitle: 'Indian Institute of Information Technology, Raichur',
		tag: 'Web Development',
		descriptions: [
			'The website includes information on events, clubs, and other opportunities for students. It uses Jekyll as a frontend.',
		],
		tags: [
			{
				name: 'jekyll',
				color: 'blue-text-gradient',
			},
			{
				name: 'github',
				color: 'green-text-gradient',
			},
			{
				name: 'vercel',
				color: 'pink-text-gradient',
			},
		],
		image: images.StudentsIIITRProjectImage,
		website: 'https://students.iiitr.ac.in',
	},
	{
		title: 'SafeRideX',
		subtitle: 'Blockchain-based Cab Booking System | Mini Project',
		tag: 'Web Development',
		descriptions: [
			'The app was built with Next.js, Tailwind CSS, and MUI for the front end, and Node.js, Express, MongoDB, Third Web, and Firebase for the backend.',
		],
		tags: [
			{
				name: 'nextjs',
				color: 'blue-text-gradient',
			},
			{
				name: 'mongodb',
				color: 'green-text-gradient',
			},
			{
				name: 'third web',
				color: 'pink-text-gradient',
			},
		],
		image: images.SafeRideXProjectImage,
	},
	{
		title: 'Deep Learning Based Real-Time Traffic Sign Detection & Classification for Self-Driving Vehicles in Smart City',
		subtitle: 'Research Project | Mini Project',
		tag: 'Neural Network',
		descriptions: [
			'Deep learning models using TensorFlow for detection and recognition achieve high accuracy and low latency.',
			'Implemented using RCNN, CNN, and Point++ Network written in Python',
		],
		tags: [
			{
				name: 'convolutional neural network',
				color: 'blue-text-gradient',
			},
			{
				name: 'python',
				color: 'green-text-gradient hidden',
			},
			{
				name: 'tensorflow',
				color: 'pink-text-gradient hidden',
			},
		],
		image: images.NeuralNetworkProjectImage,
	},
	{
		title: 'IIITR Chatbot',
		subtitle: 'Natural Language Processing | Course Project',
		tag: 'Neural Network',
		descriptions: [
			'A chatbot based on the Feed Forward Neural Network was implemented using Python.',
			'Designed to assist new students, faculty, and staff in navigating various aspects of college life.',
		],
		tags: [
			{
				name: 'feed forward neural network',
				color: 'blue-text-gradient',
			},
			{
				name: 'python',
				color: 'green-text-gradient hidden',
			},
			{
				name: 'tensorflow',
				color: 'pink-text-gradient hidden',
			},
		],
		image: images.NeuralNetworkProjectImage,
	},
	{
		title: 'Project India 2021',
		subtitle: 'Project India 2021 Official GitHub Organization',
		tag: 'Open Source Project',
		descriptions: [
			'India has 50k operational HWCs, and by 2022, 155k SHC, PHC, and UPHC will be converted into HWCs.',
			'A new technology is being developed to connect HWCs, and an app is being developed to let users find the closest HWCs and get verified information.',
		],
		tags: [
			{
				name: 'open source project',
				color: 'blue-text-gradient',
			},
		],
		image: images.Project2021ProjectImage,
		github: 'https://github.com/Project-India-21',
		external: true,
	},
]

export const transition = (direction: 'up' | 'down' | 'left' | 'right', delay: number) => {
	return {
		hidden: {
			y: direction === 'up' ? 80 : direction === 'down' ? -80 : 0,
			opacity: 0,
			x: direction === 'left' ? 80 : direction === 'right' ? -80 : 0,
			transition: {
				type: 'tween',
				duration: 1.5,
				delay: delay,
				ease: [0.25, 0.6, 0.3, 0.8],
			},
		},
		show: {
			y: 0,
			x: 0,
			opacity: 1,
			transition: {
				type: 'tween',
				duration: 1.4,
				delay: delay,
				ease: [0.25, 0.25, 0.25, 0.75],
			},
		},
	}
}
