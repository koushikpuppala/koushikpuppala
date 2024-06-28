import { Image, SanityDocument } from '@sanity/types'

export type ServicesSchemaProps = SanityDocument & {
	_id: string
	title: string
	description: string
	image: Image
}
