/** @format */

import { v4 as uuidv4 } from 'uuid'
import {
	Avenger,
	AvengersAssemble,
	DiscordLists100,
	Edith,
	IIITR,
	Jai,
	Koushikpuppala,
	Musics_DJ,
	StudentIIITR,
} from '../Images'

export const PortfolioData = [
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-web',
		Title: 'Koushik Puppala',
		Description:
			'This is my first Website. Which I have made for First time, and now it has been builded on react.',
		Image: Koushikpuppala,
		Link: 'https://koushikpuppala.live',
		LinkName: 'Visit Website',
	},
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-web',
		Title: 'Avengers Assemble',
		Description:
			'This is website for Avengers Assemble Server. You can see my Two bots in this.',
		Image: AvengersAssemble,
		Link: 'https://avengers-assemble.tech',
		LinkName: 'Visit Website',
	},
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-web',
		Title: 'Jai Goyal',
		Description:
			'This is website made for my senior friend for his elections time in Indian Institute of Technology, Hyderabad.',
		Image: Jai,
		Link: 'https://vibhanshujainiiitr.github.io/jai',
		LinkName: 'Visit Website',
	},
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-web',
		Title: 'IIITR',
		Description:
			'This is our Official page of Indian Institute of Information Technology, Raichur.',
		Image: IIITR,
		Link: 'https://iiitr.ac.in',
		LinkName: 'Visit Website',
	},
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-web',
		Title: 'Student IIITR',
		Description:
			'This is our college Student page of Indian Institute of Information Technology, Raichur.',
		Image: StudentIIITR,
		Link: 'https://students.iiitr.ac.in',
		LinkName: 'Visit Website',
	},
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-app',
		Title: 'EDITH',
		Description:
			'This is my First App made this is Desktop Screen Recorder with Google Drive Access.',
		Image: Edith,
		Link: 'https://github.com/koushikpuppala/E.D.I.T.H-Screen-Recorder',
		LinkName: 'Check the Details',
	},
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-card',
		Title: 'Avenger',
		Description:
			'This is the Discord Bot which have more than 200 commands and dashboard on development.',
		Image: Avenger,
		Link: 'https://discord.com/oauth2/authorize?client_id=775412494235729960&permissions=2088762486&redirect_uri=https%3A%2F%2Fdiscord.gg%2FMsJ99j5Bcv&response_type=code&scope=bot%20guilds.join%20connections%20identify',
		LinkName: 'Add Bot to Server',
	},
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-card',
		Title: 'Musics_DJ',
		Description:
			'This is Discord Bot which have nearly hundred Music based commands and it is verified bot.',
		Image: Musics_DJ,
		Link: 'https://discord.com/oauth2/authorize?client_id=772133876813922314&permissions=305626464&redirect_uri=https%3A%2F%2Fdiscord.gg%2FMsJ99j5Bcv&response_type=code&scope=connections%20guilds.join%20identify%20bot',
		LinkName: 'Add Bot to Server',
	},
	{
		id: uuidv4(),
		Class: 'col-lg-4 col-md-6 portfolio-item filter-web',
		Title: 'Discord Lists 100',
		Description:
			'This a Discord Bots List website where you can add your bot and so many can add to there server',
		Image: DiscordLists100,
		Link: 'https://discordlists100.xyz/',
		LinkName: 'Visit Website',
	},
]
