/** @format */

import { v4 as uuidv4 } from 'uuid'
import {
	CSS,
	Docker,
	EJS,
	Express,
	Firebase,
	Git,
	HTML5,
	JavaScript,
	Mongo,
	Node,
	React,
	VisualStudio,
} from '../Images'

export const TechData = [
	{
		Id: uuidv4(),
		Name: 'React JS',
		Using: true,
		ImageUrl: React,
	},
	{
		Id: uuidv4(),
		Name: 'Mongo DB',
		Using: true,
		ImageUrl: Mongo,
	},
	{
		Id: uuidv4(),
		Name: 'Node JS',
		Using: true,
		ImageUrl: Node,
	},
	{
		Id: uuidv4(),
		Name: 'Git',
		Using: true,
		ImageUrl: Git,
	},
	{
		Id: uuidv4(),
		Name: 'CSS',
		Using: true,
		ImageUrl: CSS,
	},
	{
		Id: uuidv4(),
		Name: 'JavaScript',
		Using: true,
		ImageUrl: JavaScript,
	},
	{
		Id: uuidv4(),
		Name: 'Express',
		Using: true,
		ImageUrl: Express,
	},
	{
		Id: uuidv4(),
		Name: 'Firebase',
		Using: true,
		ImageUrl: Firebase,
	},
	{
		Id: uuidv4(),
		Name: 'Visual Studio Code',
		Using: true,
		ImageUrl: VisualStudio,
	},
	{
		Id: uuidv4(),
		Name: 'HTML',
		Using: false,
		ImageUrl: HTML5,
	},
	{
		Id: uuidv4(),
		Name: 'EJS',
		Using: false,
		ImageUrl: EJS,
	},
	{
		Id: uuidv4(),
		Name: 'Docker',
		Using: false,
		ImageUrl: Docker,
	},
]
