import { MetadataType } from '@repo/prisma'
import { PaginationDto } from 'common/dto/pagination.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString, IsUrl } from 'class-validator'

export class CreateMetadataDto {
	@ApiProperty({ enum: MetadataType, example: MetadataType.PAGE })
	@IsEnum(MetadataType)
	type!: MetadataType

	@ApiProperty({ example: 'home', description: 'Unique page or component key' })
	@IsString()
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

	@ApiPropertyOptional({ example: 'https://koushikpuppala.com/og-image.png' })
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
	robots?: string = 'index,follow'

	@ApiPropertyOptional({
		example: ['Software Engineer', 'Full Stack', 'NestJS', 'Next.js', 'PostgreSQL'],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	keywords?: string[] = []

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean = false
}

export class UpdateMetadataDto extends PartialType(CreateMetadataDto) {}

export class QueryMetadataDto extends PaginationDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({ enum: MetadataType })
	@IsEnum(MetadataType)
	@IsOptional()
	type?: MetadataType

	@ApiPropertyOptional()
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean
}
