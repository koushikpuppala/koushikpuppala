import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
	IsBoolean,
	IsInt,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	Min,
} from 'class-validator'
import { Type } from 'class-transformer'
import { PaginationDto } from 'common/dto/pagination.dto'

export class CreateSkillDto {
	@ApiProperty({ example: 'TypeScript' })
	@IsString()
	name!: string

	@ApiProperty({ example: 'Languages', description: 'Category e.g. Frontend, Backend, Database, Cloud & DevOps, Tools' })
	@IsString()
	category!: string

	@ApiPropertyOptional({ example: 'Typed JavaScript for scalable enterprise applications' })
	@IsString()
	@IsOptional()
	description?: string

	@ApiPropertyOptional({ example: 90, minimum: 1, maximum: 100 })
	@IsInt()
	@Min(1)
	@Max(100)
	@IsOptional()
	proficiency?: number

	@ApiPropertyOptional({ example: 'si:typescript', description: 'Icon identifier or SVG key' })
	@IsString()
	@IsOptional()
	icon?: string

	@ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
	@IsUUID()
	@IsOptional()
	mediaId?: string

	@ApiPropertyOptional({ example: true, default: false })
	@IsBoolean()
	@IsOptional()
	featured?: boolean = false

	@ApiPropertyOptional({ example: 0, default: 0 })
	@IsInt()
	@IsOptional()
	sortOrder?: number = 0

	@ApiPropertyOptional({ example: true, default: true })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean = true
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}

export class QuerySkillDto extends PaginationDto {
	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({ example: 'Backend' })
	@IsString()
	@IsOptional()
	category?: string

	@ApiPropertyOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@IsOptional()
	featured?: boolean

	@ApiPropertyOptional()
	@Type(() => Boolean)
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean
}
