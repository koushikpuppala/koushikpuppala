import { Image, SanityDocument } from 'sanity'

export type ProjectSchemaProps = SanityDocument & {
	_id: string
	title: string
	subtitle: string
	tag: string
	descriptions: string[]
	tags: string[]
	image: Image[]
	github?: string
	website?: string
}
