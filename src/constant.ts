import {
	BackendImage,
	IIITRLogo,
	FrontendImage,
	FullStackImage,
	GDSCLogo,
	MaplemonkLogo,
	OpenSourceImage,
	CollegeLogo,
	TGHLogo,
	SchoolLogo,
} from '@import/images'
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
	{ title: 'Full Stack Developer', icon: FullStackImage },
	{ title: 'Open Source Contributor', icon: OpenSourceImage },
	{ title: 'Frontend Developer', icon: FrontendImage },
	{ title: 'Backend Developer', icon: BackendImage },
]

export const ExperienceData = [
	{
		title: 'Full Stack Web Developer (Team Lead & Mentor)',
		company_name: 'Indian Institute of Information Technology, Raichur',
		icon: IIITRLogo,
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
		icon: MaplemonkLogo,
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
		icon: TGHLogo,
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
		icon: GDSCLogo,
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
		icon: IIITRLogo,
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
		icon: GDSCLogo,
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
		icon: IIITRLogo,
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
		icon: IIITRLogo,
		iconBg: '#E6DEDD',
		date: 'Dec 2020 - Present (Until May 2024)',
		link: 'https://iiitr.ac.in/',
	},
	{
		title: 'M.P.C Intermediate',
		college_name: 'Tirumala IIT & Medical Academy',
		icon: CollegeLogo,
		iconBg: '#E6DEDD',
		date: 'Jun 2018 - Mar 2020',
		link: 'https://tirumalaedu.com/',
	},
	{
		title: 'S.S.C',
		college_name: 'Tirumala Proactive (EM) High School',
		icon: SchoolLogo,
		iconBg: '#E6DEDD',
		date: 'Jun 2017 - Mar 2018',
		link: 'https://tirumalaedu.com/',
	},
]

export const ProjectsData = [
	{
		name: 'Car Rent',
		description: [
			'Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.',
		],
		tags: [
			{
				name: 'react',
				color: 'blue-text-gradient',
			},
			{
				name: 'mongodb',
				color: 'green-text-gradient',
			},
			{
				name: 'tailwind',
				color: 'pink-text-gradient',
			},
		],
		image: CollegeLogo,
		source_code_link: 'https://github.com/',
		website: 'https://github.com/',
	},
	{
		name: 'Car Rent',
		description: [
			'Web-based platform that allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.',
		],
		tags: [
			{
				name: 'react',
				color: 'blue-text-gradient',
			},
			{
				name: 'mongodb',
				color: 'green-text-gradient',
			},
			{
				name: 'tailwind',
				color: 'pink-text-gradient',
			},
		],
		image: CollegeLogo,
		source_code_link: 'https://github.com/',
		website: 'https://github.com/',
	},
	{
		name: 'Car Rent',
		description: [
			'Web-based platform that &',
			'allows users to search, book, and manage car rentals from various providers, providing a convenient and efficient solution for transportation needs.',
		],
		tags: [
			{
				name: 'react',
				color: 'blue-text-gradient',
			},
			{
				name: 'mongodb',
				color: 'green-text-gradient',
			},
			{
				name: 'tailwind',
				color: 'pink-text-gradient',
			},
		],
		image: CollegeLogo,
		source_code_link: 'https://github.com/',
		website: 'https://github.com/',
	},
]
