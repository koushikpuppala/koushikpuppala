import { EducationSchemaProps, ServicesSchemaProps } from '@import/types'
import { SanityAssetSource } from '@sanity/asset-utils'

export type AboutSchemaProps = {
	_rev: string
	title: string
	introduction: string
	resume: SanityAssetSource
	services: ServicesSchemaProps[]
	educations: EducationSchemaProps[]
}
