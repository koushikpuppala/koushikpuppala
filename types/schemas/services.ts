import { SanityAssetSource } from '@sanity/asset-utils'

export type ServicesSchema = {
	_key: string
	title: string
	description: string
	image: SanityAssetSource
}
