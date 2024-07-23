export type HomeSchemaProps = {
	_rev: string
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
