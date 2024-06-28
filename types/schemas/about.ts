import { SanityDocument } from '@sanity/types'
import { EducationSchemaProps, ServicesSchemaProps } from '@import/types'

export type AboutSchemaProps = SanityDocument & {
	_id: string
	title: string
	introduction: string
	services: ServicesSchemaProps[]
	educations: EducationSchemaProps[]
}
