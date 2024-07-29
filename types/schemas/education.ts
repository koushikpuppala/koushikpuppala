import { SanityAssetSource } from '@sanity/asset-utils'

export type EducationSchemaProps = {
	_key: string
	degree: string
	university: string
	startDate: string
	endDate: string
	expectedDate: string
	current: boolean
	image: SanityAssetSource
	website: string
}
