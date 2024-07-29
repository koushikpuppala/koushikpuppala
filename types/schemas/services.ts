import { SanityAssetSource } from '@sanity/asset-utils'

export type ServicesSchemaProps = {
	_key: string
	title: string
	description: string
	image: SanityAssetSource
}
