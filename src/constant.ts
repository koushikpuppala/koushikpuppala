import * as images from '@import/images'
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
]

export const ServicesData = [
	{ title: 'Full Stack Developer', icon: images.FullStackImage },
	{ title: 'Open Source Contributor', icon: images.OpenSourceImage },
	{ title: 'Frontend Developer', icon: images.FrontendImage },
	{ title: 'Backend Developer', icon: images.BackendImage },
]

export const ExperienceData = [
	{
		title: 'Full Stack Web Developer (Team Lead & Mentor)',
		company_name: 'Indian Institute of Information Technology, Raichur',
		icon: images.IIITRLogo,
		iconBg: '#E6DEDD',
		date: 'Aug 2022 - Present',
		link: 'http://iiitr.ac.in/',
		points: [
			'Led a team of developers in the achievement of project goals. Fostered collaboration, oversaw allocating responsibilities, and provided guidance and support to team members, resulting in increased productivity and a cohesive work environment.',
			'Collaborated with faculty, staff, and student organizations to gather requirements and ensure the website met their needs.',
		],
	},
	{
		title: 'Frontend Developer Internship',
		company_name: 'MapleMonk',
		icon: images.MaplemonkLogo,
		iconBg: '#383E56',
		date: 'Jun 2023 - Jul 2023',
		link: 'https://www.maplemonk.com/',
		points: [
			'Used Angular for the front end and React for Apache Superset, an open-source project.',
			'Added features to the front end, such as a support system for both the client and admin versions and theme customization for the dashboard.',
			'Added features to Superset, such as a custom date picker and theme customization at the dashboard and chart level.',
		],
	},
	{
		title: 'Full Stack Developer Internship',
		company_name: 'TGH Technologies',
		icon: images.TGHLogo,
		iconBg: '#E6DEDD',
		date: 'Aug 2022 - Sep 2022',
		link: 'https://www.tghtech.com/',
		points: [
			'A leave management system with React, Figma, Node.js, MongoDB, and Firebase. Features include approval of leave requests by admins and managers and push notifications.',
		],
	},
	{
		title: 'Google Developer Student Clubs Lead',
		company_name: 'Google Developer Student Clubs',
		icon: images.GDSCLogo,
		iconBg: '#383E56',
		date: 'Jul 2022 - Jun 2023',
		link: 'https://www.linkedin.com/company/developerstudentclubs/',
		points: [
			'Led and managed the GDSC Club, a technology community focused on innovation and collaboration.',
			'Coordinated and supervised club activities to ensure successful execution and impactful outcomes.',
			"Collaborated with other student clubs and organizations to expand the club's reach and promote interdisciplinary collaboration.",
		],
	},
	{
		title: 'CodeSoc Club Coordinator',
		company_name: 'Indian Institute of Information Technology, Raichur',
		icon: images.IIITRLogo,
		iconBg: '#E6DEDD',
		date: 'Sep 2021 - Aug 2022',
		link: 'https://iiitr.ac.in/',
		points: [
			'Coordinated and managed the activities of the Codesoc Club, a vibrant community dedicated to promoting coding culture.',
			"Organized regular coding workshops and coding competitions, providing valuable learning opportunities for club members. In addition, I managed the club's budget, allocating resources effectively to support club initiatives and events.",
		],
	},
	{
		title: 'Frontend Lead (GDSC Core Team)',
		company_name: 'Google Developer Student Clubs IIIT Raichur',
		icon: images.GDSCLogo,
		iconBg: '#383E56',
		date: 'Sep 2021 - May 2022',
		link: 'https://gdsc.community.dev/indian-institute-of-information-technology-raichur/',
		points: [
			'Led the front-end development initiatives of the GDSC Club, overseeing a team and driving the successful execution of various projects.',
			'Stayed updated with the latest trends and advancements in front-end development, sharing knowledge with the team, and organizing workshops or training sessions.',
			'Served as a facilitator for the Android app development study jam by GDSC India.',
		],
	},
	{
		title: 'Full Stack Web Developer (Task Master)',
		company_name: 'Indian Institute of Information Technology, Raichur',
		icon: images.IIITRLogo,
		iconBg: '#E6DEDD',
		date: 'Dec 2020 - Aug 2022',
		link: 'https://iiitr.ac.in/',
		points: [
			'Collaborated closely with a dedicated team to develop and maintain the website, contributing to its success and functionality.',
			'Provided valuable insights and ideas for improving website design, functionality, and user engagement.',
			'Quickly learned new technologies and tools, expanded my skill set, and contributed to the team.',
		],
	},
]

export const EducationData = [
	{
		title: 'Computer Science and Engineer (B.Tech)',
		college_name: 'Indian Institute of Information Technology, Raichur',
		icon: images.IIITRLogo,
		iconBg: '#E6DEDD',
		date: 'Dec 2020 - Present (Until May 2024)',
		link: 'https://iiitr.ac.in/',
	},
	{
		title: 'M.P.C Intermediate',
		college_name: 'Tirumala IIT & Medical Academy',
		icon: images.CollegeLogo,
		iconBg: '#E6DEDD',
		date: 'Jun 2018 - Mar 2020',
		link: 'https://tirumalaedu.com/',
	},
	{
		title: 'S.S.C',
		college_name: 'Tirumala Proactive (EM) High School',
		icon: images.SchoolLogo,
		iconBg: '#E6DEDD',
		date: 'Jun 2017 - Mar 2018',
		link: 'https://tirumalaedu.com/',
	},
]

export const ProjectTagsData = ['All', 'Web Development', 'Discord Bot', 'Windows App', 'Neural Network']

export const ProjectsData = [
	{
		title: 'Portfolio',
		subtitle: 'Personal Website | First Project',
		tag: 'Web Development',
		description: [
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
		source_code_link: 'koushikpuppala',
		website: 'https://koushikpuppala.com/',
	},
	{
		title: 'Musics_DJ',
		subtitle: 'Discord Bot | Music Player',
		tag: 'Discord Bot',
		description: [
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
		source_code_link: 'musics_dj',
	},
	{
		title: 'E.D.I.T.H Screen Recorder',
		subtitle: 'Windows App | Electron',
		tag: 'Windows App',
		description: [
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
		source_code_link: 'E.D.I.T.H-Screen-Recorder',
	},
	{
		title: 'Avenger Bot',
		subtitle: 'Discord Bot | Multi-purpose',
		tag: 'Discord Bot',
		description: [
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
		source_code_link: 'avenger',
	},
	{
		title: 'Avengers Assemble',
		subtitle: 'Discord Bots website | Dashboard',
		tag: 'Web Development',
		description: [
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
		source_code_link: 'avenger',
	},
	{
		title: 'Official Website',
		subtitle: 'Indian Institute of Information Technology, Raichur',
		tag: 'Web Development',
		description: [
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
		description: [
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
		description: [
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
		description: [
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
		description: [
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
