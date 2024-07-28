import { SanityAssetSource } from '@sanity/asset-utils'

export type ProjectSchemaProps = {
	_rev: string
	title: string
	subtitle: string
	tag: string
	descriptions: string[]
	tags: string[]
	image: SanityAssetSource[]
	github?: string
	website?: string
}
