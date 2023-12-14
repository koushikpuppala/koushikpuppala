import {
	BackendImage,
	IIITRLogo,
	FrontendImage,
	FullStackImage,
	GDSCLogo,
	MaplemonkLogo,
	OpenSourceImage,
	CollegeLogo,
	WhiteLogo,
	TGHLogo,
} from '@import/images'
import { FaLinkedinIn, FaGithub, FaDiscord, FaInstagram, FaXTwitter, FaFacebookF, FaSkype } from 'react-icons/fa6'
import { HiHome, HiUser, HiDocument, HiEnvelopeOpen, HiBriefcase, HiFolder } from 'react-icons/hi2'

export const SocialMedia = [
	{ name: 'Linkedin', href: '/linkedin', icon: FaLinkedinIn },
	{ name: 'GitHub', href: '/github', icon: FaGithub },
	{ name: 'Discord', href: '/discord', icon: FaDiscord },
	{ name: 'Skype', href: '/skype', icon: FaSkype },
	{ name: 'Instagram', href: '/instagram', icon: FaInstagram },
	{ name: 'Twitter', href: '/twitter', icon: FaXTwitter },
	{ name: 'Facebook', href: '/facebook', icon: FaFacebookF },
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
		title: 'Full Stack Web Developer (Task Lead)',
		company_name: 'Indian Institute of Information Technology, Raichur',
		icon: IIITRLogo,
		iconBg: '#E6DEDD',
		date: 'Aug 2022 - Present',
		link: 'http://iiitr.ac.in/',
		points: [
			'Collaborated with faculty, staff, and student organizations to gather requirements and ensure the website met their needs.',
			'Led a team of developers in the development of the website, fostered collaboration, achieved project objectives, and oversaw allocating responsibilities and providing guidance and support to team members, resulting in increased productivity and a cohesive work environment.',
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
			'Angular for the front end and React for Apache Superset, an open-source project, as dashboards.',
			'There are a few features on the front end, such as a support system for both the client and admin versions and theme customization for the dashboard.',
			'Added a few features to the Superset as well, such as a custom date picker and theme customization at the dashboard level and chart level in the dashboard.',
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
			'React, Figma for the front end, Node.js for the backend, MongoDB for the database, and Firebase for push notifications.',
			'There are a few features, such as the approval of leave requests by the requested reg: admin and respective manager, and a few push notifications in both the front and back end.',
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
			'Coordinated and supervised club activities, ensuring successful execution and impactful outcomes.',
			'Led and managed the GDSC Club, a community about technology focused on fostering innovation and collaboration.',
			"Coordinated with other student clubs and organizations on campus to collaborate on joint events, expanding the club's reach and promoting interdisciplinary collaboration.",
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
			'I am also a facilitator of the Android app development study jam by GDSC India.',
			'Led the front-end development initiatives of the GDSC Club, overseeing a team and driving the successful execution of various projects.',
			'Regularly stay updated with the latest trends and advancements in front-end development, sharing knowledge with the team, and organizing workshops or training sessions.',
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
			'Collaborated closely with a dedicated team to develop and maintain our college website, contributing to its success and functionality.',
			"Adapted quickly to new technologies and tools in web development, continuously expanding my skill set and contributing to the team's technical proficiency.",
			"Actively participated in team meetings, offering valuable insights and ideas for improving the website's design, functionality, and overall user engagement.",
		],
	},
]

export const EducationData = [
	{
		title: 'Computer Science and Engineer (B.Tech)',
		college_name: 'Indian Institute of Information Technology, Raichur',
		icon: WhiteLogo,
		iconBg: '#383E56',
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
]
