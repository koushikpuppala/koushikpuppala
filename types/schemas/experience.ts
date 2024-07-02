import { Image, SanityDocument } from '@sanity/types'

export type ExperienceSchemaProps = SanityDocument & {
	_id: string
	position: string
	company: string
	startDate: string
	endDate: string
	current: boolean
	description: string[]
	image: Image
	website: string
}
