import { Type } from 'class-transformer'
import { PaginationDto } from 'common/dto/pagination.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateServiceDto {
	@ApiProperty({ example: 'Full-Stack Web Development' })
	@IsString()
	title!: string

	@ApiProperty({
		example:
			'End-to-end web application development using modern frameworks, responsive designs, and robust architectures.',
	})
	@IsString()
	description!: string

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
	features?: string[] = []

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	imageId?: string

	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number = 0

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean = false
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class QueryServiceDto extends PaginationDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean
}
