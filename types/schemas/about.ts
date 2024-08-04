import { SanityAssetSource } from '@sanity/asset-utils'
import { EducationSchemaProps, ServicesSchemaProps } from '@import/types'

export type AboutSchemaProps = {
	_rev: string
	title: string
	introduction: string
	resume: SanityAssetSource
	services: ServicesSchemaProps[]
	educations: EducationSchemaProps[]
}
