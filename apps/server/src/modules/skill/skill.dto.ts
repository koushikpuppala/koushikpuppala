import { PublishFilterDto, SortableDto } from 'common/dto/publishable.dto'
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger'
import {
	IsBoolean,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	Min,
} from 'class-validator'
import { ToBoolean } from 'common/decorators/to-boolean.decorator'

export class CreateSkillDto extends SortableDto {
	@ApiProperty({ example: 'TypeScript' })
	@IsString()
	@IsNotEmpty()
	name!: string

	@ApiProperty({
		example: 'Languages',
		description: 'Category e.g. Frontend, Backend, Database, Cloud & DevOps, Tools',
	})
	@IsString()
	@IsNotEmpty()
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
	featured?: boolean

	@ApiPropertyOptional({ example: true, default: true })
	@IsBoolean()
	@IsOptional()
	isPublished?: boolean
}

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}

const SKILL_SORT_FIELDS = [
	'name',
	'category',
	'proficiency',
	'featured',
	'isPublished',
	'sortOrder',
	'createdAt',
] as const

export class QuerySkillDto extends PublishFilterDto {
	@ApiPropertyOptional({ enum: [...SKILL_SORT_FIELDS] })
	@IsIn(SKILL_SORT_FIELDS)
	@IsOptional()
	sortBy?: (typeof SKILL_SORT_FIELDS)[number]

	@ApiPropertyOptional()
	@IsString()
	@IsOptional()
	search?: string

	@ApiPropertyOptional({ example: 'Backend' })
	@IsString()
	@IsOptional()
	category?: string

	@ApiPropertyOptional()
	@ToBoolean()
	@IsBoolean()
	@IsOptional()
	featured?: boolean
}
