import { Image, SanityDocument } from '@sanity/types'

export type EducationSchemaProps = SanityDocument & {
	_id: string
	degree: string
	university: string
	startDate: string
	endDate: string
	expectedDate: string
	current: boolean
	image: Image
	website: string
}
