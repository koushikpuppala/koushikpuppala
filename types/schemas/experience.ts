import { SanityAssetSource } from '@sanity/asset-utils'

export type ExperienceSchema = {
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
