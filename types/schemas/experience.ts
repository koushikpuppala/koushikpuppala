import { Image } from '@sanity/types'

export type ExperienceSchemaProps = {
	_rev: string
	position: string
	company: string
	startDate: string
	endDate: string
	current: boolean
	description: string[]
	image: Image
	website: string
}
