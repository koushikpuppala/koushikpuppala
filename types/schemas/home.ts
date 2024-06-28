import { SanityDocument } from '@sanity/types'

export type HomeSchemaProps = SanityDocument & {
	_id: string
	title: string
	separator: string
	subtitles: string[]
	description: {
		content: string
		extend: string[]
	}
	social: {
		_id: string
		platform: string
		url: string
	}[]
}
