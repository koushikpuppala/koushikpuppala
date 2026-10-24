import { PublishFilterDto, PublishableDto } from 'common/dto/publishable.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsArray, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateServiceDto extends PublishableDto {
	@ApiProperty({ example: 'Full-Stack Web Development' })
	@IsString()
	@IsNotEmpty()
	title!: string

	@ApiPropertyOptional({ example: 'End-to-end Web Applications' })
	@IsString()
	@IsOptional()
	subtitle?: string

	@ApiProperty({
		example:
			'End-to-end web application development using modern frameworks, responsive designs, and robust architectures.',
	})
	@IsString()
	@IsNotEmpty()
	description!: string

	@ApiPropertyOptional({ example: 'si:code' })
	@IsString()
	@IsOptional()
	icon?: string

	@ApiPropertyOptional({
		example: [
			'Modern Frontend (Next.js / React)',
			'Scalable RESTful Backend (NestJS)',
			'PostgreSQL & Redis Integration',
		],
		type: [String],
	})
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	features?: string[]

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	imageId?: string
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

const SERVICE_SORT_FIELDS = ['title', 'isPublished', 'sortOrder', 'createdAt'] as const

export class QueryServiceDto extends PublishFilterDto {
	@ApiPropertyOptional({ enum: [...SERVICE_SORT_FIELDS] })
	@IsIn(SERVICE_SORT_FIELDS)
	@IsOptional()
	sortBy?: (typeof SERVICE_SORT_FIELDS)[number]

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string
}
