import type { JsonLdProps } from 'types/components/client'

// The data comes from the API, so "<" is escaped to keep a value like "</script>" from closing the tag early.
const serialize = (data: JsonLdProps['data']): string => JSON.stringify(data).replace(/</g, '\\u003c')

export const JsonLd = ({ data }: JsonLdProps) => (
	// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text, and serialize() escapes it.
	<script type='application/ld+json' dangerouslySetInnerHTML={{ __html: serialize(data) }} />
)
