import { v4 } from 'uuid'
import {
	Koushikpuppala,
	Musics_DJ,
	IIITR,
	Avenger,
	Edith,
	AvengersAssemble,
	StudentIIITR,
	DiscordLists100,
	Jai,
	Project2021,
} from '@import/image'

export const PortfolioData = [
	{
		id: v4(),
		title: 'Koushikpuppala',
		subTitle: 'My Portfolio | Official Website',
		url: 'https://koushikpuppala.com',
		description: [
			'My first project which I have made using Web development Basics and updated to the latest.',
			'This is a Full Stack Project.',
			'Front End was built using Next.js and Bootstrap.',
			'Back End was built using Node and Express.',
			'To store Contact messages I used MongoDB and Nodemailer to receive Contact messages.',
			'This is an Open Source Code on GitHub, Check my Github Profile for this code.',
		],
		image: {
			main: Koushikpuppala,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-web',
	},
	{
		id: v4(),
		title: 'Musics_DJ Bot',
		subTitle: 'Discord Bot | Music Player',
		url: 'https://koushikpuppala.com/github/musics_dj',
		description: [
			'This is also an open-source Discord Bot which I made using discord.js and JavaScript.',
			'It is having so many music commands like play, pause, skip, volume settings, etc.',
			'There are so many filter commands and playlist commands also.',
		],
		image: {
			main: Musics_DJ,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-bot',
	},
	{
		id: v4(),
		title: 'IIIT Raichur',
		subTitle: 'Official Website - IIIT Raichur',
		url: 'https://iiitr.ac.in',
		description: [
			'This is the Official Website of our College Indian Institute of Information Technology Raichur.',
			'The full website was made using Jekyll and there is no use of Backend and Database at present, Nothing about those.',
			'It has been hosted on GitLab.',
			'In this, we have everything about our college Information, Activates etc.',
		],
		image: {
			main: IIITR,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-web',
	},
	{
		id: v4(),
		title: 'Avenger Bot',
		subTitle: 'Discord Bot | Multi-purpose',
		url: 'https://koushikpuppala.com/github/avenger',
		description: [
			'This is one of my best Discord bots made by using discord.js and Javascript.',
			'It has more than 150+ commands and 13+ categories.',
			'It is an open-source, fully customizable Discord bot that is constantly growing.',
			'It also comes packed with a variety of features, such as Welcome messages and farewell messages, Extensive Logging for 37 events, Slash Commands, Advanced auto-moderation, Audio filters for music plugins, Custom playlist support, Giveaways, Reaction roles, And much more! There are over 40+ settings to tweak!',
		],
		image: {
			main: Avenger,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-bot',
	},
	{
		id: v4(),
		title: 'E.D.I.T.H Screen Recorder',
		subTitle: 'Windows Application | Screen Recorder',
		url: 'https://koushikpuppala.com/github/E.D.I.T.H-Screen-Recorder',
		description: [
			'This is a Screen recording Application created for our Semester Project.',
			'It was built using Electron, HTML, and Javascript.',
			'This application has Google Login and Google Drive Authentication.',
			"The recorded video will be auto-uploaded to the User's google drive if the user logged in using google.",
		],
		image: {
			main: Edith,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-app',
	},
	{
		id: v4(),
		title: 'Avengers Assemble',
		subTitle: 'Discord Bots website and dashboard',
		url: 'https://koushikpuppala.com/github/avenger',
		description: [
			'This is a Discord bot website and dashboard which have 250+ commands and which is still under development.',
			'The Frontend was built using EJS(Embedded JavaScript)',
			'The Backend was built using Node and Express',
			'I used MongoDB to store data of the dashboard',
			'In this, we are using Discord Login to use the Discord Bot Dashboard and to identify the server that they can manage',
			'It is having dashboard so that it will be easy to customize or change bot settings.',
			'I am going to add bot hosting like pinging of websites which are hosted replit and glitch to make them 24/7 online.',
		],
		image: {
			main: AvengersAssemble,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-web',
	},
	{
		id: v4(),
		title: 'Students IIIT Raichur',
		subTitle: 'Council of Students Affairs Official Website - IIIT Raichur',
		url: 'https://students.iiitr.ac.in',
		description: [
			'This is the Official Website for the Council of Student Affairs of the Indian Institute of Information Technology, Raichur.',
			'Front-end was made using Jekyll hosted on GitLab.',
			'Backend was discord integration using express.',
			'It is hosted on Replit.',
			'In this we have everything about Information, Activates, Clubs that Students what to know etc.',
		],
		image: {
			main: StudentIIITR,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-web',
	},
	{
		id: v4(),
		title: 'Discord Developer Studios',
		subTitle: 'Discord Lists Website',
		url: 'https://github.com/dscdevstudios',
		description: [
			'This is where we can find the best discord bots and you can also add your bots, increasing the server count and it will help others to reach your discord bot.',
			'The Frontend was built using a pug.',
			'The Backend was built using Express and Discord Login Integration.',
			'The Database was MongoDB.',
		],
		image: {
			main: DiscordLists100,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-web',
	},
	{
		id: v4(),
		title: 'Jai Goyal',
		subTitle: 'Election Advertise Website - Jai Goyal',
		url: 'https://vibhanshujainiiitr.github.io/jai',
		description: [
			'This is an very basic website made for my friend who is studying in IITH.',
			'It was made for this election time on 2021 academic year.',
			'It was built using basic HTML and CSS along with JavaScript. It was hosted using GitHub Pages',
		],
		image: {
			main: Jai,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-web',
	},
	{
		id: v4(),
		title: 'Project India 2021',
		subTitle: 'Project India 2021 Official GitHub Organization',
		url: 'https://github.com/Project-India-21',
		description: [
			"India has ~50000 Health & Wellness Centres (HWC's) up and running.",
			'By 2022, the government plans to transform 150000 Sub Health Centres (SHC), Primary Health Centres (PHC) and Urban Primary Health Centres (UPHC) as HWC’s.',
			'We have conceptualized an advanced way to connect HWC’s - for user accessibility, service utilization, full information, and quality control.',
			'We are developing an application which will enable a user to locate the nearest Health and Wellness Centres and know verified details.',
		],
		image: {
			main: Project2021,
			desktop: '',
			mobile: '',
		},
		filter: 'filter-open',
	},
]

export const SkillsData = [
	{
		id: v4(),
		name: 'NodeJS',
		percentage: 100,
	},
	{
		id: v4(),
		name: 'HTML',
		percentage: 100,
	},
	{
		id: v4(),
		name: 'Express',
		percentage: 100,
	},
	{
		id: v4(),
		name: 'JavaScript',
		percentage: 90,
	},
	{
		id: v4(),
		name: 'EJS',
		percentage: 90,
	},
	{
		id: v4(),
		name: 'CSS',
		percentage: 80,
	},
	{
		id: v4(),
		name: 'React',
		percentage: 80,
	},
	{
		id: v4(),
		name: 'NextJS',
		percentage: 80,
	},
	{
		id: v4(),
		name: 'MongoDB',
		percentage: 75,
	},
	{
		id: v4(),
		name: 'TypeScript',
		percentage: 40,
	},
]

export const InterestData = [
	{
		id: v4(),
		name: 'Open Source',
		icon: 'ri-open-source-line',
		color: '#11DBCF',
	},
	{
		id: v4(),
		name: 'Full Stack Development',
		icon: 'ri-stack-line',
		color: '#FFBB2C',
	},
	{
		id: v4(),
		name: 'MERN Stack Development',
		icon: 'ri-code-s-slash-line',
		color: '#4233FF',
	},
	{
		id: v4(),
		name: 'Discord Bots Development',
		icon: 'ri-discord-line',
		color: '#FFA76E',
	},
	{
		id: v4(),
		name: 'Android Apps Development',
		icon: 'ri-android-line',
		color: '#5578FF',
	},
	{
		id: v4(),
		name: 'Game Development',
		icon: 'ri-gamepad-line',
		color: '#E80368',
	},
	{
		id: v4(),
		name: 'Artificial Intelligence',
		icon: 'ri-cpu-line',
		color: '#E361FF',
	},
	{
		id: v4(),
		name: 'Machine Learning',
		icon: 'ri-settings-5-line',
		color: '#47AEFF',
	},
]
