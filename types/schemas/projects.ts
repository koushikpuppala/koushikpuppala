import { Image } from '@sanity/types'

export type ProjectSchemaProps = {
	_rev: string
	title: string
	subtitle: string
	tag: string
	descriptions: string[]
	tags: string[]
	image: Image[]
	github?: string
	website?: string
}
