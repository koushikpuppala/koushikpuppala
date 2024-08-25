import { SanityAssetSource } from '@sanity/asset-utils'
import { EducationSchema, ServicesSchema } from '@import/types'

export type AboutSchema = {
	_rev: string
	title: string
	introduction: string
	resume: SanityAssetSource
	services: ServicesSchema[]
	educations: EducationSchema[]
}
