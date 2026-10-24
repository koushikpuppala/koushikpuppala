import { PublishFilterDto, PublishFlagDto } from 'common/dto/publishable.dto'
import { MetadataType } from '@repo/prisma'
import { Transform, type TransformFnParams } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
	IsArray,
	IsEnum,
	IsIn,
	IsNotEmpty,
	IsObject,
	IsOptional,
	IsString,
	IsUrl,
} from 'class-validator'

export class CreateMetadataDto extends PublishFlagDto {
	@ApiProperty({ enum: MetadataType, example: MetadataType.PAGE })
	@IsEnum(MetadataType)
	type!: MetadataType

	@ApiProperty({ example: 'home', description: 'Unique page or component key' })
	@IsString()
	@IsNotEmpty()
	key!: string

	@ApiProperty({
		example: {
			title: 'Koushik Puppala | Software Engineer',
			description: 'Portfolio and personal website of Koushik Puppala, Software Engineer.',
			robots: 'index, follow',
		},
	})
	@IsObject()
	value!: Record<string, unknown>

	@ApiPropertyOptional({ example: 'Koushik Puppala | Software Engineer' })
	@IsString()
	@IsOptional()
	title?: string

	@ApiPropertyOptional({ example: 'Portfolio of Koushik Puppala, Software Engineer at Upraised.' })
	@IsString()
	@IsOptional()
	description?: string

	@ApiPropertyOptional({
		example: 'https://cdn.example.com/images/og-banner.webp',
		description: 'URL of uploaded media; must be served from CDN_URL',
	})
	@IsUrl()
	@IsOptional()
	ogImage?: string

	@ApiPropertyOptional({ example: 'https://koushikpuppala.com' })
	@IsUrl()
	@IsOptional()
	canonicalUrl?: string

	@ApiPropertyOptional({
		example: 'index,follow',
		default: 'index,follow',
		description: 'Robots meta directive',
	})
	@IsString()
	@IsOptional()
	robots?: string

	@ApiPropertyOptional({
		example: ['Software Engineer', 'Full Stack', 'NestJS', 'Next.js', 'PostgreSQL'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	keywords?: string[]
}

export class UpdateMetadataDto extends PartialType(CreateMetadataDto) {}

const METADATA_SORT_FIELDS = [
	'key',
	'title',
	'type',
	'robots',
	'isPublished',
	'createdAt',
	'updatedAt',
] as const

export class QueryMetadataDto extends PublishFilterDto {
	@ApiPropertyOptional({ enum: [...METADATA_SORT_FIELDS] })
	@IsIn(METADATA_SORT_FIELDS)
	@IsOptional()
	sortBy?: (typeof METADATA_SORT_FIELDS)[number]

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({
		type: [String],
		example: ['/', '/about'],
		description: 'Exact page or component keys (repeat the parameter for several)',
	})
	@Transform(({ value }: TransformFnParams) => (Array.isArray(value) ? value : [value]))
	@IsString({ each: true })
	@IsOptional()
	key?: string[]

	@ApiPropertyOptional({ enum: MetadataType })
	@IsEnum(MetadataType)
	@IsOptional()
	type?: MetadataType
}
