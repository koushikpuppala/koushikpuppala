import { EducationSchemaProps, ServicesSchemaProps } from '@import/types'

export type AboutSchemaProps = {
	_rev: string
	title: string
	introduction: string
	services: ServicesSchemaProps[]
	educations: EducationSchemaProps[]
}
