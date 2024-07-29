import { SanityAssetSource } from '@sanity/asset-utils'

export type ExperienceSchemaProps = {
	_rev: string
	position: string
	company: string
	startDate: string
	endDate: string
	current: boolean
	description: string[]
	image: SanityAssetSource
	website: string
}
