import { Image, SanityDocument } from 'sanity'

export type ServicesSchemaProps = SanityDocument & {
	_id: string
	title: string
	description: string
	image: Image
}
