import { StaticImageData } from 'next/image'

export interface EducationDataProps {
	degree: string
	college: string
	startDate: string
	endDate: string
	image: StaticImageData
	imageBackground: string
	website: string
}

export interface ExperienceDataProps {
	role: string
	company: string
	startDate: string
	endDate: string
	descriptions: string[]
	image: StaticImageData
	imageBackground: string
	website: string
}

export interface ProjectDataProps {
	title: string
	subtitle: string
	tag: string
	descriptions: string[]
	tags: {
		name: string
		color: string
	}[]
	image: StaticImageData
	github?: string
	website?: string
	external?: boolean
}
