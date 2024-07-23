import { Image } from '@sanity/types'

export type EducationSchemaProps = {
	_key: string
	degree: string
	university: string
	startDate: string
	endDate: string
	expectedDate: string
	current: boolean
	image: Image
	website: string
}
